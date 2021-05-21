/**@jsx jsx */
import {jsx} from '@emotion/react'
import * as React from 'react'
import {FiSearch, FiX} from 'react-icons/fi'
import {useQuery} from 'react-query'
import client from 'utils/api-client'
import {BookListUL, Input, Spinner, Tooltip} from 'components/lib'
import BookItem from 'components/book-item'
import bookPlaceholderSvg from 'assets/placeholder.svg'
import colors from 'styles/colors'

const loading = {
  title: '加载中…',
  author: '加载中…',
  publisher: '加载中…',
  summary: '加载中…',
  loading: true,
  coverImageUrl: bookPlaceholderSvg,
}

const loadingBooks = Array.from({length: 10}, (_, index) => ({
  id: `loading-book-${index}`,
  ...loading,
}))

export default function DiscoverScreen({user}) {
  const [query, setQuery] = React.useState('')
  const [queried, setQueried] = React.useState(false)
  const {
    data: books = loadingBooks,
    error,
    isLoading,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ['bookSearch', {query}],
    queryFn: () =>
      client(`books?query=${encodeURIComponent(query)}`, {
        token: user.token,
      }).then((data) => data.books),
  })

  function handleSubmit(event) {
    event.preventDefault()
    setQueried(true)
    setQuery(event.target.elements.search.value)
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Input
          placeholder="搜索书籍…"
          id="search"
          css={{width: '100%'}}
          variant="primary"
        />
        <Tooltip label="搜索书籍">
          <label htmlFor="search">
            <button
              type="submit"
              css={{
                border: '0',
                position: 'relative',
                marginLeft: '-35px',
                top: '2px',
                background: 'transparent',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignContent: 'center',
              }}>
              {isLoading ? (
                <Spinner />
              ) : isError ? (
                <FiX aria-label="错误" css={{color: colors.danger}} />
              ) : (
                <FiSearch aria-label="搜索" />
              )}
            </button>
          </label>
        </Tooltip>
      </form>

      {isError ? (
        <div
          css={{
            color: colors.danger,
          }}>
          <p>抱歉！出错了。刷新试试~</p>
          <pre>{error.message}</pre>
        </div>
      ) : null}
      <div>
        {queried ? null : (
          <div css={{marginTop: 20, fontSize: '1.2em', textAlign: 'center'}}>
            {isLoading ? (
              <div css={{width: '100%', margin: 'auto'}}>
                <Spinner />
              </div>
            ) : isSuccess && books.length ? null : isSuccess &&
              !books.length ? (
              <p>抱歉…书库暂时是空的…</p>
            ) : null}
          </div>
        )}
      </div>
      {isSuccess ? (
        books.length ? (
          <BookListUL css={{marginTop: '2em'}}>
            {books.map((book) => (
              <li key={book.id} aria-label={book.title}>
                <BookItem key={book.id} book={book} user={user} />
              </li>
            ))}
          </BookListUL>
        ) : (
          <div>
            <p>非常抱歉，没有找到相关书籍。请重新搜索。</p>
          </div>
        )
      ) : null}
    </div>
  )
}
