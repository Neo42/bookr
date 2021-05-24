import * as React from 'react'
import {PENDING, IDLE, RESOLVED, REJECTED} from 'constant'

function useSafeDispatch(dispatch) {
  const mounted = React.useRef(false)
  React.useLayoutEffect(() => {
    mounted.current = true
    return () => (mounted.current = false)
  }, [])
  return React.useCallback(
    // tricky part: args forward (destructuring) & ref.current
    (...args) => (mounted.current ? dispatch(...args) : void 0),
    [dispatch],
  )
}

const defaultInitialState = {
  status: IDLE,
  data: null,
  error: null,
}

export default function useAsync(initialState) {
  const initialStateRef = React.useRef({
    ...defaultInitialState,
    ...initialState,
  })

  const [{data, error, status}, setState] = React.useReducer(
    (s, a) => ({...s, ...a}),
    initialStateRef.current,
  )

  const safeSetState = useSafeDispatch(setState)

  const setData = React.useCallback(
    (data) => safeSetState({data, status: RESOLVED}),
    [safeSetState],
  )

  const setError = React.useCallback(
    (error) => safeSetState({error, status: REJECTED}),
    [safeSetState],
  )
  const reset = React.useCallback(
    () => safeSetState(initialStateRef.current),
    [safeSetState],
  )

  const run = React.useCallback(
    (promise) => {
      if (!promise || !promise.then) {
        throw new Error('TypeError: useAsync.run 需要一个 promise 类型的参数。')
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
    [safeSetState, setData, setError],
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
