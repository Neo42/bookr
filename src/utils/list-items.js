import {queryCache, useMutation, useQuery} from 'react-query'
import {useClient} from 'auth/context'
import {setQueryDataForBook} from './books'
import {DELETE, LISTITEMS, PUT} from 'constant'

function useListItems() {
  const client = useClient()
  const {data: listItems} = useQuery({
    queryKey: LISTITEMS,
    queryFn: () => client(LISTITEMS).then((data) => data.listItems),
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
  onError: (_, __, recover) =>
    typeof recover === 'function' ? recover() : null,
  onSettled: () => queryCache.invalidateQueries(LISTITEMS),
  throwOnError: true,
}

function useUpdateListItem(options) {
  const client = useClient()
  return useMutation(
    (updates) =>
      client(`${LISTITEMS}/${updates.id}`, {
        method: PUT,
        data: updates,
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
  const client = useClient()
  return useMutation(({bookId}) => client(LISTITEMS, {data: {bookId}}), {
    ...defaultMutationOption,
    ...options,
  })
}

function useRemoveListItem(options) {
  const client = useClient()
  return useMutation(({id}) => client(`${LISTITEMS}/${id}`, {method: DELETE}), {
    onMutate(removedItem) {
      const previousItems = queryCache.getQueryData(LISTITEMS)
      queryCache.setQueryData(LISTITEMS, (old) =>
        old.filter((item) => item.id !== removedItem.id),
      )
      return () => queryCache.setQueryData(LISTITEMS, previousItems)
    },
    ...defaultMutationOption,
    ...options,
  })
}

export {
  useListItem,
  useListItems,
  useUpdateListItem,
  useCreateListItem,
  useRemoveListItem,
}
