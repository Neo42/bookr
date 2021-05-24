import * as React from 'react'

const AuthContext = React.createContext()

function useAuth() {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth 必须在一个 AuthContext Provider 之内使用。')
  }
  return context
}

export {AuthContext, useAuth}
