import * as React from 'react'
import faker from 'faker'
import App from 'apps/app'
import {
  loginAsUser,
  render,
  screen,
  userEvent,
  waitForLoadingToFinish,
} from 'mocks/test-utils'
import * as booksDB from 'mocks/data/books'
import * as listItemsDB from 'mocks/data/list-items'
import {mockBook, mockListItem} from 'mocks/generate'
import {formatDate} from 'utils/misc'

test('渲染所有书籍信息', async () => {
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

test('可为书籍创建列表项目', async () => {
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
    formatDate(Date.now()),
  )

  expect(
    screen.queryByRole('button', {name: /加入书单/}),
  ).not.toBeInTheDocument()
  expect(
    screen.queryByRole('button', {name: /标为未读/}),
  ).not.toBeInTheDocument()
  expect(screen.queryByRole('radio', {name: /评分/})).not.toBeInTheDocument()
})

test('可为书籍移除列表项目', async () => {
  const user = await loginAsUser()
  const book = await booksDB.create(mockBook())
  const route = `/book/${book.id}`
  await listItemsDB.create(mockListItem({owner: user, book}))

  await render(<App />, {route, user})

  const removeButton = screen.getByRole('button', {name: /移除/})
  userEvent.click(removeButton)
  expect(removeButton).toBeDisabled()

  await waitForLoadingToFinish()

  expect(screen.getByRole('button', {name: /加入书单/})).toBeInTheDocument()
  expect(screen.queryByRole('button', {name: /移除/})).not.toBeInTheDocument()
})

test('可将一个列表项目标为已读', async () => {
  const user = await loginAsUser()
  const book = await booksDB.create(mockBook())
  const route = `/book/${book.id}`
  const listItem = mockListItem({
    owner: user,
    book,
    finishDate: null,
  })
  await listItemsDB.create(listItem)

  await render(<App />, {route, user})

  const markAsReadButton = screen.getByRole('button', {name: /标为已读/})
  userEvent.click(markAsReadButton)
  expect(markAsReadButton).toBeDisabled()

  await waitForLoadingToFinish()

  expect(screen.getByLabelText(/起止日期/)).toHaveTextContent(
    `${formatDate(listItem.startDate)} — ${formatDate(Date.now())}`,
  )
  expect(screen.getByRole('button', {name: /标为未读/})).toBeInTheDocument()
  expect(screen.getAllByRole('radio')).toHaveLength(5)
  expect(
    screen.queryByRole('button', {name: /标为已读/}),
  ).not.toBeInTheDocument()
})

test('可编辑笔记', async () => {
  jest.useFakeTimers()
  const user = await loginAsUser()
  const book = await booksDB.create(mockBook())
  const listItem = await listItemsDB.create(mockListItem({owner: user, book}))
  const route = `/book/${book.id}`

  await render(<App />, {route, user})

  const newNotes = faker.lorem.words()
  const notesTextarea = screen.getByRole('textbox', {name: /笔记/})

  userEvent.clear(notesTextarea)
  userEvent.type(notesTextarea, newNotes)

  expect(notesTextarea).toHaveValue(newNotes)

  await screen.findByLabelText(/加载中/)
  await waitForLoadingToFinish()

  expect(await listItemsDB.read(listItem.id)).toMatchObject({
    notes: newNotes,
  })
})
