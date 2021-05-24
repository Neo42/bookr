import 'styles/bootstrap'
import * as React from 'react'
import ReactDOM from 'react-dom'
import {ReactQueryConfigProvider} from 'react-query'
import App from 'apps/app'
import {AuthProvider} from 'auth/context'

const queryConfig = {
  queries: {
    useErrorBoundary: true,
    refetchOnWindowFocus: false,
    retry(failureCount, error) {
      if (error.status === 404) return false
      else if (failureCount < 2) return true
      else return false
    },
  },
}

ReactDOM.render(
  <ReactQueryConfigProvider config={queryConfig}>
    <AuthProvider>
      <App />
    </AuthProvider>
  </ReactQueryConfigProvider>,
  document.getElementById('root'),
)
