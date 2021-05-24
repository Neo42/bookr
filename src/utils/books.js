import * as React from 'react'
import {queryCache, useQuery} from 'react-query'
import {useAuth} from 'auth/context'
import client from './api-client'
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

const getBookSearchConfig = (query, user) => ({
  queryKey: [BOOKSEARCH, {query}],
  queryFn: () =>
    client(`books?query=${encodeURIComponent(query)}`, {
      token: user.token,
    }).then((data) => data.books),
  config: {
    onSuccess(books) {
      books.forEach((book) => setQueryDataForBook(book))
    },
  },
})

function useBookSearch(query) {
  const {user} = useAuth()
  const result = useQuery(getBookSearchConfig(query, user))
  return {...result, books: result.data ?? loadings}
}

function useBook(bookId) {
  const {user} = useAuth()
  const {data} = useQuery({
    queryKey: [BOOK, {bookId}],
    queryFn: () =>
      client(`books/${bookId}`, {token: user.token}).then((data) => data.book),
  })
  return data ?? loading
}

function useRefetchBookSearchQuery() {
  const {user} = useAuth()
  return React.useCallback(
    async function refetchBookSearchQuery() {
      queryCache.removeQueries(BOOKSEARCH)
      await queryCache.prefetchQuery(getBookSearchConfig('', user))
    },
    [user],
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
