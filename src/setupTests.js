import '@testing-library/jest-dom'
import {server} from 'mocks/server/test-server'
import {queryCache} from 'react-query'
import * as auth from 'auth/provider'
import * as booksDB from 'mocks/data/books'
import * as listItemsDB from 'mocks/data/list-items'
import * as usersDB from 'mocks/data/users'

beforeAll(() => server.listen())
afterAll(() => server.close())
afterEach(() => server.resetHandlers())

// general cleanup for test isolation
afterEach(async () => {
  queryCache.clear()
  await Promise.all([
    auth.logout(),
    usersDB.reset(),
    booksDB.reset(),
    listItemsDB.reset(),
  ])
})
