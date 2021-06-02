import * as React from 'react'
import faker from 'faker'
import App from 'apps/app'
import {server, rest} from 'mocks/server/test-server'
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

const apiUrl = process.env.REACT_APP_API_URL

const renderBookScreen = async ({book, user, listItem} = {}) => {
  book = book === undefined ? await booksDB.create(mockBook()) : book
  user = user === undefined ? await loginAsUser() : user
  listItem =
    listItem === undefined
      ? await listItemsDB.create(mockListItem({owner: user, book}))
      : listItem

  const route = `/book/${book.id}`
  const utils = await render(<App />, {route, user})

  return {
    ...utils,
    book,
    user,
    listItem,
  }
}

test('渲染所有书籍信息', async () => {
  const {book} = await renderBookScreen({listItem: null})
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
  await renderBookScreen({listItem: null})

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
  await renderBookScreen()

  const removeButton = screen.getByRole('button', {name: /移除/})
  userEvent.click(removeButton)
  expect(removeButton).toBeDisabled()

  await waitForLoadingToFinish()

  expect(screen.getByRole('button', {name: /加入书单/})).toBeInTheDocument()
  expect(screen.queryByRole('button', {name: /移除/})).not.toBeInTheDocument()
})

test('可将一个列表项目标为已读', async () => {
  const {listItem} = await renderBookScreen()
  await listItemsDB.update(listItem.id, {finishDate: null})

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

  const {listItem} = await renderBookScreen()

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

describe('console errors', () => {
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterAll(() => {
    console.error.mockRestore()
  })

  test('当书籍载入失败时显示错误信息', async () => {
    const book = {id: 'FAKE_BAD_ID'}
    await renderBookScreen({listItem: null, book})

    expect(
      (await screen.findByRole('alert')).textContent,
    ).toMatchInlineSnapshot(`"出错了：没有找到书籍。"`)
    expect(console.error).toHaveBeenCalled()
  })

  test('当笔记更新失败时显示错误信息', async () => {
    jest.useFakeTimers()
    await renderBookScreen()

    const newNotes = faker.lorem.words()
    const notesTextarea = screen.getByRole('textbox', {name: /笔记/})

    const testErrorMessage = '__test_error_message__'
    server.use(
      rest.put(`${apiUrl}/list-items/:listItemId`, async (req, res, ctx) => {
        return res(
          ctx.status(400),
          ctx.json({status: 400, message: testErrorMessage}),
        )
      }),
    )

    userEvent.type(notesTextarea, newNotes)

    await screen.findByLabelText(/加载中/)
    await waitForLoadingToFinish()

    expect(screen.getByRole('alert').textContent).toMatchInlineSnapshot(
      `"出错了：__test_error_message__"`,
    )
  })
})
