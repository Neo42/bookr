import {server, rest} from 'mocks/server/test-server'
import client from 'utils/api-client'
import {TEST} from 'constant'

const apiUrl = process.env.REACT_APP_API_URL

beforeAll(() => server.listen())
afterAll(() => server.close())
beforeEach(() => server.resetHandlers())

test(`send GET requests to the provided endpoint`, async () => {
  const mockResult = {mockValue: 'VALUE'}
  server.use(
    rest.get(`${apiUrl}/${TEST}`, async (req, res, ctx) => {
      return res(ctx.json(mockResult))
    }),
  )
  const result = await client(TEST)
  expect(result).toEqual(mockResult)
})

test(`uses auth token when a token is provided`, async () => {})

test(`allows for custom config`, async () => {})

test(`stringifies the provided data (if any) and wdefaults the  method to POST`, async () => {})
