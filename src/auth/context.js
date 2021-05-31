import * as React from 'react'
import {queryCache} from 'react-query'
import * as auth from './provider'
import client from 'utils/api-client'
import useAsync from 'utils/hooks'
import {FullPageErrorFallback, FullPageSpinner} from 'components/lib'
import {BOOTSTRAP, LISTITEMS} from 'constant'

async function bootstrapAppData() {
  let user = null
  const token = await auth.getToken()
  if (token) {
    const data = await client(BOOTSTRAP, {token})
    queryCache.setQueryData(LISTITEMS, data.listItems, {staleTime: 5000})
    user = data.user
  }
  return user
}

// ! comment the line below to pass the test for book screen
const appDataPromise = bootstrapAppData()

const AuthProvider = (props) => {
  const {
    data: user,
    setData: setUser,
    error,
    isLoading,
    isIdle,
    isError,
    isSuccess,
    run,
  } = useAsync()

  React.useEffect(() => {
    // ! uncomment the line below to pass the test for book screen
    // const appDataPromise = bootstrapAppData()
    run(appDataPromise)
  }, [run])

  const login = React.useCallback(
    (form) => auth.login(form).then((u) => setUser(u)),
    [setUser],
  )
  const register = React.useCallback(
    (form) => auth.register(form).then((u) => setUser(u)),
    [setUser],
  )
  const logout = React.useCallback(() => {
    auth.logout()
    queryCache.clear()
    setUser(null)
  }, [setUser])

  const value = React.useMemo(
    () => ({register, login, logout, user}),
    [login, logout, register, user],
  )

  if (isLoading || isIdle) {
    return <FullPageSpinner />
  }

  if (isError) {
    return <FullPageErrorFallback error={error} />
  }

  if (isSuccess) {
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

export {AuthProvider, useAuth, useClient}
