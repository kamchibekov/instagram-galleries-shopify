import React from 'react'
import { connect } from 'react-redux'
import { Form, Button, FormLayout, TextField, Card, Layout } from '@shopify/polaris'
import { install } from '../redux/actions'

class Home extends React.Component {
  constructor() {
    super()
    this.state = {
      shop: '',
      loading: false,
      error: '',
    }
  }

  handleShopChange(shop) {
    const state = this.state
    if (shop) {
      state.error = ''
    }
    this.setState({ ...state, shop: shop })
  }

  handleSubmit() {
    if (this.state.shop.length) {
      this.setState({ ...this.state, loading: true })
      install(this.state.shop)
    } else {
      this.setState({ ...this.state, error: 'Store name is required' })
    }
  }

  render() {
    const userWelcome = <Layout.AnnotatedSection
      title="Great! You are in!"
    >
      <Card sectioned>
        <Button primary onClick={() => this.props.history.push('/connect-account')}>Start creating!</Button>
      </Card>
    </Layout.AnnotatedSection>

    const installForm = <Layout.AnnotatedSection
      title="Install or Login"
      description="In order to install/login our app, please provide your shop name and submit the form"
    >
      <Card sectioned>
        <Form onSubmit={this.handleSubmit}>
          <FormLayout>
            <TextField
              value={this.state.shop}
              onChange={this.handleShopChange}
              label="Store name"
              error={this.state.error}
            />
            <Button submit primary loading={this.state.loading}>GO!</Button>
          </FormLayout>
        </Form>
      </Card>
    </Layout.AnnotatedSection>

    return this.props.shop._id ? userWelcome : installForm
  }
}


export default connect((state) => {
  return {
    shop: state.shop,
  }
})(Home)
