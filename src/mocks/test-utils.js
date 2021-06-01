import userEvent from '@testing-library/user-event'
import {
  render as rtlRender,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react'
import AppProviders from 'auth'
import * as usersDB from 'mocks/data/users'
import {mockUser} from 'mocks/generate'
import {userTokenKey} from 'constant'

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

const render = async (
  ui,
  {route = '/reading', user, ...renderOptions} = {},
) => {
  user = typeof user === 'undefined' ? await loginAsUser() : user
  window.history.pushState({}, '测试页面', route)
  const returnValue = {
    ...rtlRender(ui, {wrapper: AppProviders, ...renderOptions}),
    user,
  }
  await waitForLoadingToFinish()
  return returnValue
}

export * from '@testing-library/react'
export {waitForLoadingToFinish, loginAsUser, render, userEvent}
