'use strict'
import React from 'react'
import { connect } from 'react-redux'
import { Frame } from '@shopify/polaris'
import NewGallery from './NewGallery'
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom'
import Home from './Home'
import Navigation from './Navigation'
import Dashboard from './Dashboard'
import ConnectAccount from './ConnectAccount'
import { checkAuth } from '../redux/actions'

class App extends React.Component {
  componentDidMount() {
    this.props.dispatch(checkAuth())
  }

  render() {
    return (
      <Router>
        <Frame topBar={<Navigation {...this.props.shop} />}>
          <Route path="/" exact component={Home} />
          <Route path="/connect-account" component={ConnectAccount} />
          <Route path="/new-gallery" component={NewGallery} />
          <Route path="/dashboard" component={Dashboard} />
        </Frame>
      </Router>
    )
  }
}

export default connect(
  (state) => {
    return {
      dispatch: state.dispatch,
      shop: state.shop,
    }
  },
)(App)
