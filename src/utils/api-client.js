export default function client(
  endpoint,
  {token, headers: customHeaders, ...customConfig} = {}
) {
  const config = {
    method: 'GET',
    headers: {
      // "Bearer", not "Bear"
      Authorization: token ? `Bearer ${token}` : undefined,
      ...customHeaders,
    },
    ...customConfig,
  }
  return window
    .fetch(`${process.env.REACT_APP_API_URL}/${endpoint}`, config)
    .then(async (response) => {
      const data = await response.json()
      if (response.ok) {
        return data
      } else {
        return Promise.reject(data)
      }
    })
}
