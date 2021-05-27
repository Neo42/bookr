import {queryCache} from 'react-query'
import * as auth from 'auth/provider'
import {GET, POST} from 'constant'

export default function client(
  endpoint,
  {data, token, headers: customHeaders, ...customConfig} = {},
) {
  const config = {
    method: data ? POST : GET,
    body: data ? JSON.stringify(data) : undefined,
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
      'Content-Type': data ? 'application/json' : undefined,
      ...customHeaders,
    },
    ...customConfig,
  }

  return window
    .fetch(`${process.env.REACT_APP_API_URL}/${endpoint}`, config)
    .then(async (response) => {
      if (response.status === 401) {
        await auth.logout()
        queryCache.clear()
        window.location.assign(window.location)
        return Promise.reject({
          message: '因用户身份无效而请求失败，请重新登录。',
        })
      }
      const data = await response.json()
      if (response.ok) {
        return data
      } else {
        return Promise.reject(data)
      }
    })
}
