import * as React from 'react'
import {queryCache, useQuery} from 'react-query'
import {useClient} from 'auth/context'
import {BOOK, BOOKSEARCH} from 'constant'
import bookPlaceholderSvg from 'assets/placeholder.svg'

const loading = {
  title: '加载中…',
  author: '加载中…',
  publisher: '加载中…',
  summary: '加载中…',
  loading: true,
  coverImageUrl: bookPlaceholderSvg,
}

const loadings = Array.from({length: 10}, (_, index) => ({
  id: `loading-${index}`,
  ...loading,
}))

const getBookSearchConfig = (query, client) => ({
  queryKey: [BOOKSEARCH, {query}],
  queryFn: () =>
    client(`books?query=${encodeURIComponent(query)}`).then(
      (data) => data.books,
    ),
  config: {
    onSuccess(books) {
      books.forEach((book) => setQueryDataForBook(book))
    },
  },
})

function useBookSearch(query) {
  const client = useClient()
  const result = useQuery(getBookSearchConfig(query, client))
  return {...result, books: result.data ?? loadings}
}

function useBook(bookId) {
  const client = useClient()
  const {data} = useQuery({
    queryKey: [BOOK, {bookId}],
    queryFn: () => client(`books/${bookId}`).then((data) => data.book),
  })
  return data ?? loading
}

function useRefetchBookSearchQuery() {
  const client = useClient()
  return React.useCallback(
    async function refetchBookSearchQuery() {
      queryCache.removeQueries(BOOKSEARCH)
      await queryCache.prefetchQuery(getBookSearchConfig('', client))
    },
    [client],
  )
}

const bookQueryConfig = {
  staleTime: 1000 * 60 * 60,
  cacheTime: 1000 * 60 * 60,
}

function setQueryDataForBook(book) {
  queryCache.setQueryData([BOOK, {bookId: book.id}], book, bookQueryConfig)
}

export {useBook, useBookSearch, useRefetchBookSearchQuery, setQueryDataForBook}
