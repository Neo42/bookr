import React from 'react'
import ReactDOM from 'react-dom'
import './bootstrap'
import App from './app'

ReactDOM.render(<App />, document.querySelector('#root'))

if (module.hot) {
  module.hot.accept()
}
