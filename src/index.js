'use strict'
import React from 'react'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import ReactDOM from 'react-dom'
import { AppProvider } from '@shopify/polaris'
import Reducers from './redux/reducers'
import App from './components/App'
import Thunk from 'redux-thunk'
import en from '@shopify/polaris/locales/en.json'

const store =
  createStore(Reducers, applyMiddleware(Thunk) /* , window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()*/)

const theme = {
  colors: {
    topBar: {
      background: '#357997',
      backgroundLighter: '#6192a9',
      color: '#FFFFFF',
    },
  },
  logo: {
    width: 124,
    topBarSource:
      'assets/img/logo.png',
    accessibilityLabel: 'NomadDev',
    contextualSaveBarSource:
      'assets/img/logo.png',
  },
}

ReactDOM.render(
  <Provider store={store}>
    <AppProvider
      theme={theme}
      i18n={{ en }}>
      <App />
    </AppProvider>
  </Provider>, document.getElementById('app'))
