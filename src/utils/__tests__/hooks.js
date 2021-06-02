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

test(`用一个将会 resolve 的 promise 调用 run`, async () => {
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

test(`用一个将会 reject 的 promise 调用 run`, async () => {
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

test(`可设置初始状态`, async () => {
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

test(`可设置数据`, async () => {
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

test(`可设置错误信息`, async () => {
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

test(`当组件在 pending 状态下解除挂载时不会出现状态更新`, async () => {
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

test(`不使用 promise 调用 run 时会导致报错`, async () => {
  const {result} = renderHook(() => useAsync())
  expect(() => result.current.run()).toThrowErrorMatchingInlineSnapshot(
    `"TypeError: useAsync.run requires an argument whose type is Promise."`,
  )
})
