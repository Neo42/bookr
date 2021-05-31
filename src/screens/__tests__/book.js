import * as React from 'react'
import {queryCache} from 'react-query'
import {render, screen, waitForElementToBeRemoved} from '@testing-library/react'
import App from 'apps/app'
import AppProviders from 'auth'
import {userTokenKey} from 'constant'

test('render all the book information', async () => {
  window.localStorage.setItem(userTokenKey, 'FAKE_TOKEN')

  const originalFetch = window.fetch
  window.fetch = async (url, config) => {
    if (url.endsWith('/bootstrap')) {
      return {
        ok: true,
        json: async () => ({
          user: {username: 'hao'},
          listItems: [],
        }),
      }
    }
    return originalFetch(url, config)
  }

  render(<App />, {wrapper: AppProviders})
  await waitForElementToBeRemoved(() => screen.getByLabelText(/加载中/i))
  screen.debug()
})
