import {listItemsKey} from 'constant'
import * as booksDB from './books'

let listItems = {}

const save = () =>
  window.localStorage.setItem(listItemsKey, JSON.stringify(listItems))
const load = () =>
  Object.assign(
    listItems,
    JSON.parse(window.localStorage.getItem(listItemsKey)),
  )

try {
  load()
} catch (error) {
  save()
}

window.__bookshelf = window.__bookshelf || {}
window.__bookshelf.deleteListItems = () => {
  Object.keys(listItems).forEach((key) => {
    delete listItems[key]
  })
  save()
}

function required(key) {
  const error = new Error(`需要传入 ${key}。`)
  error.status = 400
  throw error
}

function hash(str) {
  let hash = 4791,
    i = str.length

  while (i) {
    hash = (hash * 77) ^ str.charCodeAt(--i)
  }
  return String(hash >> 0)
}

function validateListItem(id) {
  load()
  if (!listItems[id]) {
    const error = new Error(`没有找到 id 为 "${id}" 的书籍。`)
    error.status = 404
    throw error
  }
}

async function authorize(userId, listItemId) {
  const listItem = await read(listItemId)
  if (listItem.ownerId !== userId) {
    const error = new Error('当前用户没有权限查看该条目。')
    error.status = 403
    throw error
  }
}

async function create({
  bookId = required('bookId'),
  ownerId = required('ownerId'),
  rating = -1,
  notes = '',
  startDate = Date.now(),
  finishDate = null,
}) {
  const id = hash(`${bookId}${ownerId}`)
  if (listItems[id]) {
    const error = new Error(`书籍已存在，不能重复添加。`)
    error.status = 400
    throw error
  }
  const book = await booksDB.read(bookId)
  if (!book) {
    const error = new Error(`没有找到 ID 为 ${bookId} 的书籍。`)
    error.status = 400
    throw error
  }
  listItems[id] = {id, bookId, ownerId, rating, notes, startDate, finishDate}
  save()
  return read(id)
}

async function read(id) {
  validateListItem(id)
  return listItems[id]
}

async function update(id, updates) {
  validateListItem(id)
  Object.assign(listItems[id], updates)
  save()
  return read(id)
}

async function remove(id) {
  validateListItem(id)
  delete listItems[id]
  save()
}

async function readMany(userId, listItemIds) {
  return Promise.all(
    listItemIds.map((id) => {
      authorize(userId, id)
      return read(id)
    }),
  )
}

async function readByOwner(userId) {
  return Object.values(listItems).filter(({ownerId}) => ownerId === userId)
}

async function reset() {
  listItems = {}
  save()
}

export {authorize, create, read, update, remove, readMany, readByOwner, reset}
