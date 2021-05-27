import '@testing-library/jest-dom'
import {server} from 'mocks/server/test-server'

// start server before all tests
beforeAll(() => server.listen())
// close server after all tests
afterAll(() => server.close())
// reset all handlers after each test
afterEach(() => server.resetHandlers())
