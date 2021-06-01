import * as React from 'react'
import App from 'apps/app'
import * as booksDB from 'mocks/data/books'
import {
  render,
  screen,
  userEvent,
  waitForLoadingToFinish,
} from 'mocks/test-utils'
import {mockBook} from 'mocks/generate'
import {formatDate} from 'utils/misc'

test('render all the book information', async () => {
  const book = await booksDB.create(mockBook())
  const route = `/book/${book.id}`
  await render(<App />, {route})

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
  const book = await booksDB.create(mockBook())
  const route = `/book/${book.id}`
  await render(<App />, {route})

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
})
