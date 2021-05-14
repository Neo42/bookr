/** @jsx jsx */
import {jsx} from '@emotion/react'
import * as React from 'react'
import client from './utils/api-client'
import {useAsync} from './utils/hooks'
import UnAuthorizedApp from './unauthorized-app'
import AuthorizedApp from './authorized-app'
import * as auth from './auth-provider'
import {FullPageFallback, FullPageSpinner} from '../src/components/lib'

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
    return user ? (
      <AuthorizedApp logout={logout} user={user} />
    ) : (
      <UnAuthorizedApp login={login} register={register} />
    )
  }
}
