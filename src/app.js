/** @jsx jsx */
import {jsx} from '@emotion/react'
import * as React from 'react'
import UnAuthorizedApp from './unauthorized-app'
import AuthorizedApp from './authorized-app'
import * as auth from './auth-provider'
import client from './utils/api-client'

export default function App() {
  const [user, setUser] = React.useState(null)
  React.useEffect(() => getUser().then((u) => setUser(u)), [])

  const login = (form) => auth.login(form).then((u) => setUser(u))
  const register = (form) => auth.register(form).then((u) => setUser(u))
  const logout = () => {
    auth.logout()
    setUser(null)
  }

  async function getUser() {
    const token = await auth.getToken()
    if (token) {
      const {user} = await client('me', {token})
      return user
    }
    return null
  }

  return user ? (
    <AuthorizedApp logout={logout} user={user} />
  ) : (
    <UnAuthorizedApp login={login} register={register} />
  )
}
