import {renderHook, act} from '@testing-library/react-hooks'
import {IDLE, PENDING, REJECTED, RESOLVED} from 'constant'
import useAsync from '../hooks'

const defaultState = {
  isSuccess: false,
  isError: false,
  isLoading: false,
  isIdle: true,

  status: IDLE,
  data: null,
  error: null,

  setData: expect.any(Function),
  setError: expect.any(Function),
  reset: expect.any(Function),
  run: expect.any(Function),
}

const pendingState = {
  ...defaultState,
  status: PENDING,
  isIdle: false,
  isLoading: true,
}

const resolvedState = {
  ...defaultState,
  status: RESOLVED,
  isIdle: false,
  isSuccess: true,
}

const rejectedState = {
  ...defaultState,
  status: REJECTED,
  isIdle: false,
  isError: true,
}

function deferred() {
  let resolve, reject
  const promise = new Promise((res, rej) => {
    resolve = res
    reject = rej
  })
  return {promise, resolve, reject}
}

test(`call run with a promise that resolves`, async () => {
  jest.spyOn(console, 'error').mockImplementation(() => {})
  const {promise, resolve} = deferred()

  // use `renderHook` instead of fire the hook from a component
  const {result} = renderHook(() => useAsync())

  expect(result.current).toEqual(defaultState)

  let p
  act(() => {
    p = result.current.run(promise)
  })

  expect(result.current).toEqual(pendingState)

  const resolvedValue = Symbol('resolved value')

  await act(async () => {
    resolve(resolvedValue)
    await p
  })

  expect(result.current).toEqual({
    ...resolvedState,
    data: resolvedValue,
  })

  act(() => {
    result.current.reset()
  })

  expect(result.current).toEqual(defaultState)
  console.error.mockRestore()
})

test(`call run with a promise that rejects`, async () => {
  jest.spyOn(console, 'error').mockImplementation(() => {})
  const {promise, reject} = deferred()
  // use `renderHook` instead of fire the hook from a component
  const {result} = renderHook(() => useAsync())

  expect(result.current).toEqual(defaultState)

  let p
  act(() => {
    p = result.current.run(promise)
  })

  expect(result.current).toEqual(pendingState)

  const rejectedValue = Symbol('rejected value')

  await act(async () => {
    reject(rejectedValue)
    await p
  })

  expect(result.current).toEqual({
    ...rejectedState,
    error: rejectedValue,
  })

  act(() => {
    result.current.reset()
  })

  expect(result.current).toEqual(defaultState)
  console.error.mockRestore()
})

test(`can specify the initial state`, async () => {
  jest.spyOn(console, 'error').mockImplementation(() => {})
  const mockData = Symbol('resolved value')
  const customInitialState = {status: RESOLVED, data: mockData}
  const {result} = renderHook(() => useAsync(customInitialState))
  expect(result.current).toEqual({
    ...resolvedState,
    data: mockData,
  })
  console.error.mockRestore()
})

test(`can set the data`, async () => {
  jest.spyOn(console, 'error').mockImplementation(() => {})
  const mockData = Symbol('resolved value')
  const {result} = renderHook(() => useAsync())

  act(() => {
    result.current.setData(mockData)
  })

  expect(result.current).toEqual({
    ...resolvedState,
    data: mockData,
  })
  console.error.mockRestore()
})

test(`can set the error`, async () => {
  jest.spyOn(console, 'error').mockImplementation(() => {})
  const mockData = Symbol('rejected value')
  const {result} = renderHook(() => useAsync())

  act(() => {
    result.current.setError(mockData)
  })

  expect(result.current).toEqual({
    ...rejectedState,
    error: mockData,
  })
  console.error.mockRestore()
})

test(`No state updates happen if the component is unmounted during pending`, async () => {
  jest.spyOn(console, 'error').mockImplementation(() => {})

  const {promise, resolve} = deferred()
  const {result, unmount} = renderHook(() => useAsync())

  let p
  act(() => {
    p = result.current.run(promise)
  })
  unmount()
  await act(async () => {
    resolve()
    await p
  })

  expect(console.error).not.toHaveBeenCalled()
  console.error.mockRestore()
})

test(`calling run without a promise causes an early error`, async () => {
  const {result} = renderHook(() => useAsync())
  expect(() => result.current.run()).toThrowErrorMatchingInlineSnapshot(
    `"TypeError: useAsync.run requires an argument whose type is Promise."`,
  )
})
