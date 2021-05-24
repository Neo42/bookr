/** @jsx jsx */
import {jsx} from '@emotion/react'
import * as React from 'react'
import {BrowserRouter as Router} from 'react-router-dom'
import {queryCache} from 'react-query'
import {AuthContext} from 'auth/context'
import * as auth from 'auth/provider'
import useAsync from 'utils/hooks'
import client from 'utils/api-client'
import UnAuthenticatedApp from './unauthenticated-app'
import AuthenticatedApp from './authenticated-app'
import {FullPageFallback, FullPageSpinner} from 'components/lib'

export default function App() {
  const {
    data: user,
    setData: setUser,
    isLoading,
    isIdle,
    isError,
    isSuccess,
    run,
  } = useAsync()

  React.useEffect(() => run(getUser()), [run])

  const login = (form) => auth.login(form).then((u) => setUser(u))
  const register = (form) => auth.register(form).then((u) => setUser(u))
  const logout = () => {
    auth.logout()
    queryCache.clear()
    setUser(null)
  }

  async function getUser() {
    const token = await auth.getToken()
    if (!token) {
      return null
    }
    const data = await client('me', {token})
    return data.user
  }

  if (isLoading || isIdle) {
    return <FullPageSpinner />
  }

  if (isError) {
    return <FullPageFallback />
  }

  if (isSuccess) {
    const props = {register, login, logout, user}
    return (
      <AuthContext.Provider value={props}>
        {user ? (
          <Router>
            <AuthenticatedApp />
          </Router>
        ) : (
          <UnAuthenticatedApp />
        )}
      </AuthContext.Provider>
    )
  }
}
