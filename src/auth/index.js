import * as React from 'react'
import {ReactQueryConfigProvider} from 'react-query'
import {ReactQueryDevtools} from 'react-query-devtools'
import {BrowserRouter as Router} from 'react-router-dom'
import {AuthProvider} from './context'

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

export default function AppProviders({children}) {
  return (
    <ReactQueryConfigProvider config={queryConfig}>
      <Router>
        <AuthProvider>{children}</AuthProvider>
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </ReactQueryConfigProvider>
  )
}
