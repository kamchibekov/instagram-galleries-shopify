import React from 'react'
import { connect } from 'react-redux'
import {
  Card, Button, AccountConnection,
  ResourceList, Avatar, TextStyle, Banner, Stack, TextContainer,
} from '@shopify/polaris'
import axios from 'axios'
import { getConnectedAccounts } from '../redux/actions'

export function connectedAccounts(accounts) {
  return accounts ? <Card title="Connected accounts">
    {accounts.map((account, i) => <Card.Section
      key={i}
      title={
        <Stack spacing="extraTight">
          <Avatar
            name={account.name}
            customer={false}
            initials={account.name.charAt(0)}
            size="medium"
            source={account.profile_picture_url}
          />
          <TextContainer spacing="tight">
            <p><TextStyle variation="Strong">{account.name}</TextStyle></p>
            <p><TextStyle variation="subdued">@{account.username}</TextStyle></p>
          </TextContainer>
        </Stack>
      } />)}
  </Card> : ''
}

class ConnectAccount extends React.Component {
  constructor() {
    super()
    this.state = {
      account: {
        connected: false,
        accountName: 'Facebook account',
        avatarUrl: '',
      },
    }
  }

  componentDidMount() {
    if (!this.props.connectedAccounts.length) {
      this.props.dispatch(getConnectedAccounts())
    }
  }

  updateAccountInfo(data) {
    const account = this.state.account
    account.accountName = data.fbAccount.name
    account.avatarUrl = data.fbAccount.picture.data.url
    account.connected = true
    const instagramAccounts = data.instagramAccounts.map((instagramAccount) => {
      instagramAccount.id = parseInt(instagramAccount.ig_id)
      return instagramAccount
    })

    this.props.dispatch({
      type: 'CONNECTED_ACCOUNT',
      value: instagramAccounts,
    })

    this.setState({ account })
  }

  async onAccountConnect() {
    const response = await axios.get('/fb/auth')
    if (!window.AccountConnectListener) {
      window.AccountConnectListener = true
      this.setState({ ...this.state })
      window.addEventListener('message', (event) => {
        if (!this.state.account.connected && event.data && event.data.fbAccount) {
          this.updateAccountInfo(event.data)
        }
      })
    }
    window.open(response.data.url, '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes')
  }

  onNext() {
    this.props.history.push('/dashboard')
  }

  render() {
    return <Card title="Connect an Account" sectioned>

      <AccountConnection
        accountName={this.state.account.accountName}
        connected={this.state.account.connected}
        title={this.state.account.accountName}
        action={{
          content: this.state.account.connected ? 'Change' : 'Connect',
          onAction: this.onAccountConnect,
        }}
        avatarUrl={this.state.account.avatarUrl}
        details={this.state.account.connected ? 'Account connected' : 'No account connected'}
      />

      {this.props.connectedAccounts.length ? <Card>
        <Banner
          title="Connected Instagram Accounts"
          status="success"
        />
        <ResourceList
          resourceName={{ singular: 'account', plural: 'accounts' }}
          items={this.props.connectedAccounts}
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
        <br />
        <Button submit primary fullWidth onClick={this.onNext}>Next</Button>
      </Card> : ''}

    </Card>
  }
}

export default connect((state) => {
  return {
    connectedAccounts: state.connectedAccounts,
  }
})(ConnectAccount)
