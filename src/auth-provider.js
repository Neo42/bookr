import {LOGIN, REGISTER, userTokenKey} from './constants'

async function getToken() {
  return window.localStorage.getItem(userTokenKey)
}

function handleUserResponse({user}) {
  window.localStorage.setItem(userTokenKey, user.token)
  return user
}

function login({username, password}) {
  return client(LOGIN, {username, password}).then(handleUserResponse)
}

function register({username, password}) {
  return client(REGISTER, {username, password}).then(handleUserResponse)
}

function logout() {
  window.localStorage.removeItem(userTokenKey)
}

const authURL = process.env.REACT_APP_AUTH_URL

async function client(endpoint, data) {
  const config = {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {'Content-Type': 'application/json'},
  }
  return window
    .fetch(`${authURL}/${endpoint}`, config)
    .then(async (response) => {
      const data = await response.json()
      if (response.ok) {
        return data
      } else {
        return Promise.reject(data)
      }
    })
}

export {getToken, register, login, logout}
