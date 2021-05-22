import {queryCache, useQuery} from 'react-query'
import client from './api-client'
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
  queryKey: ['bookSearch', {query}],
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

function useBookSearch(query, user) {
  const result = useQuery(getBookSearchConfig(query, user))
  return {...result, books: result.data ?? loadings}
}

function useBook(bookId, user) {
  const {data} = useQuery({
    queryKey: ['book', {bookId}],
    queryFn: () =>
      client(`books/${bookId}`, {token: user.token}).then((data) => data.book),
  })
  return data ?? loading
}

function refetchBookSearchQuery(user) {
  queryCache.removeQueries('bookSearch')
  queryCache.prefetchQuery(getBookSearchConfig('', user))
}

function setQueryDataForBook(book) {
  queryCache.setQueryData(['book', {bookId: book.id}], book)
}

export {useBookSearch, useBook, refetchBookSearchQuery, setQueryDataForBook}
