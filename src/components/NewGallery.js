import React from 'react'
import { connect } from 'react-redux'
import {
  TextField, Card, Form, Tag, FormLayout, Button,
  ResourceList, Avatar, TextStyle, Toast,
} from '@shopify/polaris'
import { createNewGallery, getConnectedAccounts } from '../redux/actions'

class NewGallery extends React.Component {
  state = {
    title: '',
    description: '',
    hashtags: [],
    add_input: '',
    title_error: '',
    add_input_error: '',
    saving_gallery: false,
    selected_accounts: [],
    serverError: [],
  }

  componentDidMount() {
    if (!this.props.connectedAccounts.length) {
      this.props.dispatch(getConnectedAccounts())
    }
  }

  handleChange(field, value) {
    const newState = this.state
    if (value && newState[field + '_error']) {
      newState[field + '_error'] = ''
    }
    newState[field] = value
    this.setState(newState)
  }

  addKeyword(e) {
    const newState = this.state
    if ([13, 188, 32].includes(e.keyCode) && this.state.add_input.length) {
      if (this.state.hashtags.indexOf(this.state.add_input) !== -1) {
        newState.add_input_error = 'Value already exists'
      } else {
        const hashtag = '#' + this.state.add_input.replace(/[ #@,]/g, '')

        this.state.hashtags.push(hashtag)
        newState.add_input = ''
        newState.add_input_error = ''
      }

      this.setState(newState)
      e.preventDefault()
      e.target.focus()
    }
  }

  async handleSubmit() {
    let error = false

    if (!this.state.title.trim()) {
      this.state.title_error = 'Gallery title cannot be empty'
      error = true
    }

    if (!this.state.hashtags.length && !this.state.selected_accounts.length) {
      this.state.serverError.push('Account or Hashtag is required')
      error = true
    }


    if (error) {
      this.setState({ ...this.state })
      return false
    } else {
      // Create gallery
      this.setState({ ...this.state, saving_gallery: true })

      this.props.dispatch(createNewGallery({
        title: this.state.title,
        description: this.state.description,
        instagramAccounts: this.state.selected_accounts.map((id) => String(id)),
        hashtags: this.state.hashtags,
      }, this.props.history))
    }
  }

  keywordRemove(keyword) {
    const index = this.state.hashtags.indexOf(keyword)
    if (index !== -1) {
      this.state.hashtags.splice(index, 1)
      this.setState(this.state)
    }
  }

  toggleToast() {
    this.setState({ serverError: [] })
  }

  render() {
    const toastMarkup = this.state.serverError.length ? (
      this.state.serverError.map((error, i) => {
        return <Toast key={i} content={error} error onDismiss={this.toggleToast} />
      })
    ) : null

    return <Card title="Create a Gallery" sectioned>

      <Form onSubmit={this.handleSubmit}>
        <FormLayout>

          <TextField
            value={this.state.title}
            required
            error={this.state.title_error}
            onChange={(value) => {
              this.handleChange('title', value)
            }}
            label="Title"
            helpText={
              <span>
                Gallery title will be displayed on top of gallery
              </span>
            }
          />

          <TextField
            value={this.state.description}
            required
            onChange={(value) => {
              this.handleChange('description', value)
            }}
            label="Description"
            helpText={
              <span>
                Description will be displayed under the title
              </span>
            }
          />

          <Card>
            <ResourceList
              resourceName={{ singular: 'account', plural: 'accounts' }}
              items={this.props.connectedAccounts}
              selectedItems={this.state.selected_accounts}
              selectable
              onSelectionChange={(selected_accounts) => this.setState({ selected_accounts })}
              renderItem={(item) => {
                const { id, name, username, profile_picture_url } = item
                const media = <Avatar account size="medium" source={profile_picture_url} />

                return (
                  <ResourceList.Item
                    id={id}
                    media={media}
                    persistActions
                  >
                    <h3>
                      <TextStyle variation="strong">{name}</TextStyle>
                    </h3>
                    <div>{username}</div>
                  </ResourceList.Item>
                )
              }}
            />
          </Card>


          <div>
            {this.state.hashtags.map((keyword, i) =>
              <span key={i} style={{ margin: '0 5px 5px 0' }}>
                <Tag onRemove={() => this.keywordRemove(keyword)}>
                  {keyword}
                </Tag>
              </span>,
            )}
          </div>

          <div onKeyDown={this.addKeyword}>
            <TextField
              value={this.state.add_input}
              error={this.state.add_input_error}
              onChange={(value) => {
                this.handleChange('add_input', value)
              }}
              label="Add hashtags"
              helpText={
                <span>
                  Create gallery using hashtags
                </span>
              }
            />
          </div>
          {toastMarkup}
          <Button submit primary fullWidth loading={this.state.saving_gallery}>Submit</Button>
        </FormLayout>
      </Form>

    </Card>
  }
}

export default connect((state) => {
  return {
    gallery: state.gallery,
    connectedAccounts: state.connectedAccounts,
  }
})(NewGallery)
