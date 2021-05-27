import {queryCache} from 'react-query'
import {server, rest} from 'mocks/server/test-server'
import client from 'utils/api-client'
import {POST, PUT, TEST_ENDPOINT} from 'constant'
import * as auth from 'auth/provider'

const apiUrl = process.env.REACT_APP_API_URL

// hand all functions in modules to jest as mock functions
jest.mock('react-query')
jest.mock('auth/provider')

// start server before all tests
beforeAll(() => server.listen())
// close server after all tests
afterAll(() => server.close())
// reset all handlers after each test
afterEach(() => server.resetHandlers())

test(`send GET requests to the provided endpoint`, async () => {
  const mockResult = {mockValue: 'VALUE'}
  server.use(
    rest.get(`${apiUrl}/${TEST_ENDPOINT}`, async (_, res, ctx) => {
      return res(ctx.json(mockResult))
    }),
  )

  const result = await client(TEST_ENDPOINT)

  expect(result).toEqual(mockResult)
})

test(`uses auth token when a token is provided`, async () => {
  let request = null
  const mockResult = {mockValue: 'VALUE'}
  const token = 'TOKEN'
  server.use(
    rest.get(`${apiUrl}/${TEST_ENDPOINT}`, async (req, res, ctx) => {
      request = req
      return res(ctx.json(mockResult))
    }),
  )

  await client(TEST_ENDPOINT, {token})

  expect(request.headers.get('Authorization')).toBe(`Bearer ${token}`)
})

test(`allows for custom config`, async () => {
  let request = null
  const mockResult = {mockValue: 'VALUE'}
  server.use(
    rest.put(`${apiUrl}/${TEST_ENDPOINT}`, async (req, res, ctx) => {
      request = req
      return res(ctx.json(mockResult))
    }),
  )

  const customConfig = {
    method: PUT,
    headers: {'Content-Type': 'contentType'},
  }

  await client(TEST_ENDPOINT, customConfig)

  expect(request.headers.get('Content-Type')).toBe(
    customConfig.headers['Content-Type'],
  )
})

test(`stringifies the provided data (if any) and defaults the method to POST`, async () => {
  const data = {a: 'b'}
  let request
  server.use(
    rest.post(`${apiUrl}/${TEST_ENDPOINT}`, async (req, res, ctx) => {
      request = req
      return res(ctx.json(req.body))
    }),
  )

  const result = await client(TEST_ENDPOINT, {data})

  expect(request.method).toBe(POST)
  expect(result).toEqual(data)
})

test(`log out the user if a request returns a 401`, async () => {
  const mockResult = {mockValue: 'VALUE'}
  server.use(
    rest.get(`${apiUrl}/${TEST_ENDPOINT}`, async (_, res, ctx) => {
      return res(ctx.status(401), ctx.json(mockResult))
    }),
  )

  const result = await client(TEST_ENDPOINT).catch((error) => error)

  expect(result.message).toMatchInlineSnapshot(
    `"因用户身份无效而请求失败，请重新登录。"`,
  )
  expect(queryCache.clear).toHaveBeenCalledTimes(1)
  expect(auth.logout).toHaveBeenCalledTimes(1)
})
