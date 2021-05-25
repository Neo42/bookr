import * as React from 'react'
import {useAuth} from 'auth/context'
import {FullPageSpinner} from 'components/lib'

const AuthenticatedApp = React.lazy(() =>
  // AuthenticatedApp will always be needed after a user login
  // so here we tell webpack to prefetch it for us
  import(
    /* webpackPrefetch: true */
    './authenticated-app'
  ),
)
const UnAuthenticatedApp = React.lazy(() => import('./unauthenticated-app'))

export default function App() {
  const {user} = useAuth()
  return (
    <React.Suspense fallback={<FullPageSpinner />}>
      {user ? <AuthenticatedApp /> : <UnAuthenticatedApp />}
    </React.Suspense>
  )
}
