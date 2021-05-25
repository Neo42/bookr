import * as React from 'react'
import ReactDOM from 'react-dom'
import App from 'apps/app'
import AppProviders from 'auth'
import 'styles/bootstrap'

ReactDOM.render(
  <AppProviders>
    <App />
  </AppProviders>,
  document.getElementById('root'),
)
