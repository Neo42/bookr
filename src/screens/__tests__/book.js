import * as React from 'react'
import {queryCache} from 'react-query'
import {render, screen, waitForElementToBeRemoved} from '@testing-library/react'
import App from 'apps/app'
import * as auth from 'auth/provider'
import AppProviders from 'auth'
import * as booksDB from 'mocks/data/books'
import * as listItemsDB from 'mocks/data/list-items'
import * as usersDB from 'mocks/data/users'
import {mockBook, mockUser} from 'mocks/generate'
import {userTokenKey} from 'constant'

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

test('render all the book information', async () => {
  // use msw to do mocks easily
  const user = mockUser()
  await usersDB.create(user)
  const authUser = await usersDB.authenticate(user)
  window.localStorage.setItem(userTokenKey, authUser.token)

  const book = await booksDB.create(mockBook())
  window.history.pushState({}, '测试页面', `/book/${book.id}`)

  // Mock out endpoint handlers from scratch
  // const originalFetch = window.fetch
  // window.fetch = async (url, config) => {
  //   if (url.endsWith('/bootstrap')) {
  //     return {
  //       ok: true,
  //       json: async () => ({
  //         user: {...user, token: 'FAKE_USER_TOKEN'},
  //         listItems: [],
  //       }),
  //     }
  //   } else if (url.endsWith(`/books/${book.id}`)) {
  //     return {
  //       ok: true,
  //       json: async () => ({book}),
  //     }
  //   } else if (url.endsWith('/list-items')) {
  //     return {ok: true}
  //   }
  //   return originalFetch(url, config)
  // }

  render(<App />, {wrapper: AppProviders})
  await waitForElementToBeRemoved(() => [
    ...screen.queryAllByLabelText(/加载中/),
    ...screen.queryAllByText(/加载中/),
  ])

  // screen.debug(undefined, 300000)

  expect(screen.getByRole('heading', {name: book.title})).toBeInTheDocument()
  expect(screen.getByText(book.author)).toBeInTheDocument()
  expect(screen.getByText(book.publisher)).toBeInTheDocument()
  expect(screen.getByText(book.summary)).toBeInTheDocument()
  expect(screen.getByRole('img', {name: /封面/})).toHaveAttribute(
    'src',
    book.coverUrl,
  )
  expect(screen.getByRole('button', {name: /加入书单/})).toBeInTheDocument()

  expect(
    screen.queryByRole('button', {name: /标为已读/}),
  ).not.toBeInTheDocument()
  expect(
    screen.queryByRole('button', {name: /标为未读/}),
  ).not.toBeInTheDocument()
  expect(screen.queryByRole('button', {name: /移除/})).not.toBeInTheDocument()
  expect(screen.queryByRole('textarea', {name: /笔记/})).not.toBeInTheDocument()
  expect(screen.queryByRole('radio', {name: /评分/})).not.toBeInTheDocument()
  expect(screen.queryByLabelText(/起始日期/)).not.toBeInTheDocument()
})
