import * as React from 'react'
import {queryCache} from 'react-query'
import {render, screen, waitForElementToBeRemoved} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as auth from 'auth/provider'
import AppProviders from 'auth'
import App from 'apps/app'
import * as booksDB from 'mocks/data/books'
import * as listItemsDB from 'mocks/data/list-items'
import * as usersDB from 'mocks/data/users'
import {mockBook, mockUser} from 'mocks/generate'
import {userTokenKey} from 'constant'
import {formatDate} from 'utils/misc'

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

const waitForLoadingToFinish = () =>
  waitForElementToBeRemoved(() => [
    ...screen.queryAllByLabelText(/加载中/),
    ...screen.queryAllByText(/加载中/),
  ])

const loginAsUser = async (userProperty) => {
  const user = mockUser(userProperty)
  await usersDB.create(user)
  const authUser = await usersDB.authenticate(user)
  window.localStorage.setItem(userTokenKey, authUser.token)
  return authUser
}

test('render all the book information', async () => {
  await loginAsUser()

  const book = await booksDB.create(mockBook())
  window.history.pushState({}, '测试页面', `/book/${book.id}`)

  render(<App />, {wrapper: AppProviders})
  await waitForLoadingToFinish()

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
  expect(screen.queryByRole('textbox', {name: /笔记/})).not.toBeInTheDocument()
  expect(screen.queryByRole('radio', {name: /评分/})).not.toBeInTheDocument()
  expect(screen.queryByLabelText(/起始日期/)).not.toBeInTheDocument()
})

test('can create a list item for the book', async () => {
  await loginAsUser()

  const book = await booksDB.create(mockBook())
  window.history.pushState({}, '测试页面', `/book/${book.id}`)

  render(<App />, {wrapper: AppProviders})

  await waitForLoadingToFinish()

  const addToListButton = screen.getByRole('button', {name: /加入书单/})
  userEvent.click(addToListButton)
  expect(addToListButton).toBeDisabled()

  await waitForLoadingToFinish()

  expect(screen.getByRole('button', {name: /标为已读/})).toBeInTheDocument()
  expect(screen.getByRole('button', {name: /移除/})).toBeInTheDocument()
  expect(screen.getByRole('textbox', {name: /笔记/})).toBeInTheDocument()
  expect(screen.getByLabelText(/起始日期/)).toHaveTextContent(
    formatDate(new Date()),
  )

  expect(
    screen.queryByRole('button', {name: /加入书单/}),
  ).not.toBeInTheDocument()
  expect(
    screen.queryByRole('button', {name: /标为未读/}),
  ).not.toBeInTheDocument()
  expect(screen.queryByRole('radio', {name: /评分/})).not.toBeInTheDocument()

  // screen.debug(undefined, 300000)
})
