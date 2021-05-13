import * as React from 'react'
import {PENDING, IDLE, RESOLVED, REJECTED} from '../constants'

function useSafeDispatch(dispatch) {
  const mounted = React.useRef(false)
  React.useLayoutEffect(() => {
    mounted.current = true
    return () => (mounted.current = false)
  }, [])
  return React.useCallback(
    // tricky part: args forward (destructuring) & ref.current
    (...args) => (mounted.current ? dispatch(...args) : void 0),
    [dispatch]
  )
}

const defaultInitialState = {
  status: IDLE,
  data: null,
  error: null,
}

export function useAsync(initialState) {
  const initialStateRef = React.useRef({
    ...defaultInitialState,
    ...initialState,
  })
  const [{data, error, status}, setState] = React.useReducer((s, a) => {
    console.log(a)
    return {...s, ...a}
  }, initialStateRef.current)

  const safeSetState = useSafeDispatch(setState)

  const setData = React.useCallback(
    (data) => safeSetState({data, status: RESOLVED}),
    [safeSetState]
  )
  const setError = React.useCallback(
    (error) => safeSetState({error, status: REJECTED}),
    [safeSetState]
  )
  const reset = React.useCallback(
    () => safeSetState(initialStateRef.current),
    [safeSetState]
  )

  const run = React.useCallback(
    (promise) => {
      if (!promise || !promise instanceof Promise) {
        throw new Error(
          'TypeError: A promise must be passed into useAsync.run()'
        )
      }
      safeSetState({status: PENDING})
      return promise
        .then((data) => {
          setData(data)
          return data
        })
        .catch((error) => {
          setError(error)
          return error
        })
    },
    [safeSetState, setData, setError]
  )
  return {
    isSuccess: status === RESOLVED,
    isError: status === REJECTED,
    isLoading: status === PENDING,
    isIdle: status === IDLE,
    setData,
    setError,
    status,
    data,
    error,
    reset,
    run,
  }
}
