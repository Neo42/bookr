import React from 'react'
import ReactDOM from 'react-dom'
import 'styles/bootstrap'
import App from 'apps/app'

ReactDOM.render(<App />, document.querySelector('#root'))

if (module.hot) {
  module.hot.accept()
}
