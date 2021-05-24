import * as React from 'react'
import ReactDOM from 'react-dom'
import App from 'apps/app'
import AppProvider from 'auth'
import 'styles/bootstrap'

ReactDOM.render(
  <AppProvider>
    <App />
  </AppProvider>,
  document.getElementById('root'),
)
