/**@jsx jsx */
import {jsx} from '@emotion/react'
import * as React from 'react'
import {FiSearch, FiX} from 'react-icons/fi'
import BookItem from 'components/book-item'
import {BookListUL, Input, Spinner, Tooltip} from 'components/lib'
import colors from 'styles/colors'
import {useBookSearch, useRefetchBookSearchQuery} from 'utils/books'
import Profiler from 'components/profiler'

export default function DiscoverScreen() {
  const [query, setQuery] = React.useState('')
  const [queried, setQueried] = React.useState(false)
  const {books, error, isLoading, isError, isSuccess} = useBookSearch(query)
  const refetchBookSearchQuery = useRefetchBookSearchQuery()

  React.useEffect(() => {
    return refetchBookSearchQuery()
  }, [refetchBookSearchQuery])

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
          type="search"
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
          <Profiler
            id="Dicover Screen Book List"
            metaData={{query, bookCount: books.length}}>
            <BookListUL css={{marginTop: '2em'}}>
              {books.map((book) => (
                <li key={book.id} aria-label={book.title}>
                  <BookItem key={book.id} book={book} />
                </li>
              ))}
            </BookListUL>
          </Profiler>
        ) : (
          <div>
            <p>非常抱歉，没有找到相关书籍。请重新搜索。</p>
          </div>
        )
      ) : null}
    </div>
  )
}
