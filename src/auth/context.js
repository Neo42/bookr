import * as React from 'react'
import {queryCache} from 'react-query'
import * as auth from './provider'
import client from 'utils/api-client'
import useAsync from 'utils/hooks'
import {FullPageFallback, FullPageSpinner} from 'components/lib'

const AuthProvider = (props) => {
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
    const value = {register, login, logout, user}
    return (
      <AuthContext.Provider value={value} {...props}></AuthContext.Provider>
    )
  }
}

const AuthContext = React.createContext()

function useAuth() {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth 必须在一个 AuthContext Provider 之内使用。')
  }
  return context
}

function useClient() {
  const {
    user: {token},
  } = useAuth()
  return React.useCallback(
    (endpoint, config) => client(endpoint, {...config, token}),
    [token],
  )
}

export {AuthContext, AuthProvider, useAuth, useClient}
