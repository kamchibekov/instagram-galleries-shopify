'use strict'
import React from 'react'
import { connect } from 'react-redux'
import { Switch, Route } from 'react-router-dom'
import {
  Layout,
} from '@shopify/polaris'
import { connectedAccounts } from './ConnectAccount'
import LayoutTools from './LayoutTools'
import { GalleriesList, Gallery } from './Gallery'
import { getGalleries, getConnectedAccounts } from '../redux/actions'

class Dashboard extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    if (!this.props.connectedAccounts.length) {
      this.props.dispatch(getConnectedAccounts())
    }

    if (!this.props.galleries.length) {
      this.props.dispatch(getGalleries())
    }
  }

  render() {
    return (
      <Layout>
        <Layout.Section>
          <Switch>
            <div>
              <div className="aside-component">
                <div className="aside-component-toggle">
                  <span></span>
                </div>
                <Route exact path={this.props.match.path}>
                  {connectedAccounts(this.props.connectedAccounts)}
                </Route>
                <Route path={`${this.props.match.path}/gallery/:gallery_id`}>
                  <LayoutTools />
                </Route>
              </div>

              <div className="main-component">
                <Route exact path={this.props.match.path}>
                  <GalleriesList galleries={this.props.galleries} />
                </Route>
                <Route path={`${this.props.match.path}/gallery/:gallery_id`}>
                  <Gallery />
                </Route>
              </div>
            </div>
          </Switch>
        </Layout.Section>
      </Layout>
    )
  }
}

export default connect(
  (state) => {
    return state
  },
)(Dashboard)
