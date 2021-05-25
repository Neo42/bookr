import * as React from 'react'
import ReactDOM from 'react-dom'
import Profiler from 'components/profiler'
import App from 'apps/app'
import AppProviders from 'auth'
import 'styles/bootstrap'

ReactDOM.render(
  <Profiler id="App Root" phases={['mount']}>
    <AppProviders>
      <App />
    </AppProviders>
  </Profiler>,
  document.getElementById('root'),
)
