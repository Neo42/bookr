/**@jsx jsx */
import {jsx} from '@emotion/react'
import * as React from 'react'
import Tooltip from '@reach/tooltip'
import {FiSearch, FiX} from 'react-icons/fi'
import {BookListUL, Input, Spinner} from './components/lib'
import BookItem from './components/book-item'
import {statuses} from './constants'
import client from './utils/api-client'
import * as colors from './styles/colors'

function DiscoverScreen() {
  const {LOADING, IDLE, SUCCESS, ERROR} = statuses
  const [query, setQuery] = React.useState('')
  const [data, setData] = React.useState(null)
  const [error, setError] = React.useState(null)

  const [queried, setQueried] = React.useState(false)
  const [status, setStatus] = React.useState(IDLE)

  const isLoading = status === LOADING
  const isSuccess = status === SUCCESS
  const isError = status === ERROR

  React.useEffect(() => {
    if (!queried) {
      return
    }
    setStatus(LOADING)

    client(`books?query=${encodeURIComponent(query)}`)
      .then((bookData) => {
        setData(bookData)
        setStatus(SUCCESS)
      })
      .catch((errorData) => {
        setError(errorData)
        setStatus(ERROR)
      })
  }, [ERROR, LOADING, SUCCESS, queried, query])

  function handleSubmit(event) {
    event.preventDefault()
    setQuery(event.target.elements.search.value)
    setQueried(true)
  }

  return (
    <div
      css={{
        maxWidth: 800,
        width: '90vw',
        margin: 'auto',
        padding: '40px 0',
      }}>
      <form onSubmit={handleSubmit}>
        <Input
          placeholder="搜索书籍…"
          id="search"
          css={{width: '100%'}}
          variant="secondary"
        />
        <Tooltip label="搜索书籍">
          <label htmlFor="search">
            <button
              type="submit"
              css={{
                border: '0',
                position: 'relative',
                marginLeft: '-35px',
                background: 'transparent',
                height: '100%',
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
          <p>抱歉！出错了。</p>
          <pre>{error.message}</pre>
        </div>
      ) : null}

      {isSuccess ? (
        data?.books?.length ? (
          <BookListUL css={{marginTop: '2em'}}>
            {data.books.map((book) => (
              <li key={book.id} aria-label={book.title}>
                <BookItem key={book.id} book={book} />
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

export {DiscoverScreen}
