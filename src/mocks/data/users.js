import {usersKey} from 'consts'

let users = {}

const save = () => window.localStorage.setItem(usersKey, JSON.stringify(users))

const load = () =>
  Object.assign(users, JSON.parse(window.localStorage.getItem(usersKey)))

try {
  load()
} catch (error) {
  save()
}

window.__bookshelf = window.__bookshelf || {}
window.__bookshelf.deleteUsers = () => {
  Object.keys(users).forEach((key) => delete users[key])
  save()
}

function validateUserForm({username, password}) {
  if (!username) {
    const error = new Error('用户名是必填项。')
    error.status = 400
    throw error
  }
  if (!password) {
    const error = new Error('密码是必填项。')
    error.status = 400
    throw error
  }
}

const sanitizeUser = ({password, ...rest}) => rest

function hash(str) {
  let hash = 4791,
    i = str.length

  while (i) {
    hash = (hash * 77) ^ str.charCodeAt(--i)
  }
  return String(hash >> 0)
}

async function authenticate({username, password}) {
  validateUserForm({username, password})
  const id = hash(username)
  const user = users[id] || {}
  if (user.passwordHash === hash(password)) {
    return {...sanitizeUser(user), token: btoa(user.id)}
  }
  const error = new Error('用户名或密码错误。')
  error.status = 400
  throw error
}

async function create({username, password}) {
  validateUserForm({username, password})
  const id = hash(username)
  const passwordHash = hash(password)
  if (users[id]) {
    const error = new Error(`用户名 ${username} 已被注册，请重新输入。`)
    error.status = 400
    throw error
  }
  users[id] = {id, username, passwordHash}
  save()
  return read(id)
}

function validateUser(id) {
  load()
  if (!users[id]) {
    const error = new Error(`没有找到 ID 为 ${id} 的用户。`)
    error.status = 400
    throw error
  }
}

async function read(id) {
  validateUser(id)
  return sanitizeUser(users[id])
}

async function update(id, updates) {
  validateUser(id)
  Object.assign(users[id], updates)
  save()
  return read(id)
}

async function remove(id) {
  validateUser(id)
  delete users[id]
  save()
}

async function reset() {}

export {authenticate, create, read, update, remove, reset}
