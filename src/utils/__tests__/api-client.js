import {queryCache} from 'react-query'
import {server, rest} from 'mocks/server/test-server'
import client from 'utils/api-client'
import * as auth from 'auth/provider'
import {POST, PUT, TEST_ENDPOINT} from 'constant'

const apiUrl = process.env.REACT_APP_API_URL

// hand all functions in modules to jest as mock functions
jest.mock('react-query')
jest.mock('auth/provider')

test(`发送 GET 请求到传入的 endpoint`, async () => {
  const mockResult = {mockValue: 'VALUE'}
  server.use(
    rest.get(`${apiUrl}/${TEST_ENDPOINT}`, async (_, res, ctx) => {
      return res(ctx.json(mockResult))
    }),
  )

  const result = await client(TEST_ENDPOINT)

  expect(result).toEqual(mockResult)
})

test(`在 token 被传入时对其进行使用`, async () => {
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

test(`允许自定义配置`, async () => {
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

test(`当有数据传入时将其转化为字符串并自动将方法设置成 POST`, async () => {
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

test(`当请求返回 401 时将用户登出`, async () => {
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
