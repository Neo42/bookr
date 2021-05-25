import * as React from 'react'
import {useAuth} from 'auth/context'
import {FullPageSpinner} from 'components/lib'

const AuthenticatedApp = React.lazy(() => import('./authenticated-app'))
const UnAuthenticatedApp = React.lazy(() => import('./authenticated-app'))

export default function App() {
  const {user} = useAuth()
  return (
    <React.Suspense fallback={<FullPageSpinner />}>
      {user ? <AuthenticatedApp /> : <UnAuthenticatedApp />}
    </React.Suspense>
  )
}
