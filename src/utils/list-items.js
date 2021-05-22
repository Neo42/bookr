import {queryCache, useMutation, useQuery} from 'react-query'
import {DELETE, LISTITEMS, PUT} from 'consts'
import client from './api-client'

function useListItems(user) {
  const {data: listItems} = useQuery({
    queryKey: LISTITEMS,
    queryFn: () =>
      client(LISTITEMS, {token: user.token}).then((data) => data.listItems),
  })
  return listItems ?? []
}

function useListItem(user, bookId) {
  const listItems = useListItems(user)
  return listItems.find((li) => li.bookId === bookId) ?? null
}

const defaultMutationOption = {
  onSettled: () => queryCache.invalidateQueries(LISTITEMS),
  throwOnError: true,
}

function useUpdateListItem(user, options) {
  return useMutation(
    (updates) =>
      client(`${LISTITEMS}/${updates.id}`, {
        method: PUT,
        data: updates,
        token: user.token,
      }),
    {...defaultMutationOption, ...options},
  )
}

function useCreateListItem(user, options) {
  return useMutation(
    ({bookId}) => client(LISTITEMS, {data: {bookId}, token: user.token}),
    {...defaultMutationOption, ...options},
  )
}

function useRemoveListItem(user, options) {
  return useMutation(
    ({id}) => client(`${LISTITEMS}/${id}`, {method: DELETE, token: user.token}),
    {...defaultMutationOption, ...options},
  )
}

export {
  useListItem,
  useListItems,
  useUpdateListItem,
  useCreateListItem,
  useRemoveListItem,
}
