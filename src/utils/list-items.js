import {queryCache, useMutation, useQuery} from 'react-query'
import {useAuth} from 'auth/context'
import {DELETE, LISTITEMS, PUT} from 'constant'
import client from './api-client'
import {setQueryDataForBook} from './books'

function useListItems() {
  const {user} = useAuth()
  const {data: listItems} = useQuery({
    queryKey: LISTITEMS,
    queryFn: () =>
      client(LISTITEMS, {token: user.token}).then((data) => data.listItems),
    config: {
      onSuccess(listItems) {
        listItems.forEach((listItem) => setQueryDataForBook(listItem.book))
      },
    },
  })
  return listItems ?? []
}

function useListItem(bookId) {
  const listItems = useListItems()
  return listItems.find((li) => li.bookId === bookId) ?? null
}

const defaultMutationOption = {
  onError(_, __, recover) {
    if (typeof recover === 'function') {
      recover()
    }
  },
  onSettled: () => queryCache.invalidateQueries(LISTITEMS),
  throwOnError: true,
}

function useUpdateListItem(options) {
  const {user} = useAuth()
  return useMutation(
    (updates) =>
      client(`${LISTITEMS}/${updates.id}`, {
        method: PUT,
        data: updates,
        token: user.token,
      }),
    {
      onMutate(newItem) {
        const previousItems = queryCache.getQueryData(LISTITEMS)
        queryCache.setQueryData(LISTITEMS, (old) =>
          old.map((item) =>
            item.id === newItem.id ? {...item, ...newItem} : item,
          ),
        )
        return () => queryCache.setQueryData(LISTITEMS, previousItems)
      },
      ...defaultMutationOption,
      ...options,
    },
  )
}

function useCreateListItem(options) {
  const {user} = useAuth()
  return useMutation(
    ({bookId}) => client(LISTITEMS, {data: {bookId}, token: user.token}),
    {...defaultMutationOption, ...options},
  )
}

function useRemoveListItem(options) {
  const {user} = useAuth()
  return useMutation(
    ({id}) => client(`${LISTITEMS}/${id}`, {method: DELETE, token: user.token}),
    {
      onMutate(removedItem) {
        const previousItems = queryCache.getQueryData(LISTITEMS)
        queryCache.setQueryData(LISTITEMS, (old) =>
          old.filter((item) => item.id !== removedItem.id),
        )
        return () => queryCache.setQueryData(LISTITEMS, previousItems)
      },
      ...defaultMutationOption,
      ...options,
    },
  )
}

export {
  useListItem,
  useListItems,
  useUpdateListItem,
  useCreateListItem,
  useRemoveListItem,
}
