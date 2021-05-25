import * as React from 'react'
import {useAuth} from 'auth/context'
import UnAuthenticatedApp from './unauthenticated-app'
import AuthenticatedApp from './authenticated-app'

export default function App() {
  const {user} = useAuth()
  return user ? <AuthenticatedApp /> : <UnAuthenticatedApp />
}
