/** @jsx jsx */
import {jsx} from '@emotion/react'
import * as React from 'react'
import {queryCache, useMutation, useQuery} from 'react-query'
import debounceFn from 'debounce-fn'
import {useParams} from 'react-router-dom'
import {FiCalendar} from 'react-icons/fi'
import client from 'utils/api-client'
import mq from 'styles/media-queries'
import bookPlaceholderSvg from 'assets/placeholder.svg'
import colors from 'styles/colors'
import StatusButtons from 'components/status-button'
import Rating from 'components/rating'
import {LISTITEMS, PUT} from 'consts'
import {Textarea, Tooltip} from 'components/lib'
import {formatDate} from 'utils/misc'

const loading = {
  title: '加载中…',
  author: '加载中…',
  publisher: '加载中…',
  summary: '加载中…',
  loading: true,
  coverImageUrl: bookPlaceholderSvg,
}

export default function BookScreen({user}) {
  const {bookId} = useParams()

  const {data: book = loading} = useQuery({
    queryKey: ['book', {bookId}],
    queryFn: () =>
      client(`books/${bookId}`, {token: user.token}).then((data) => data.book),
  })

  const {data: listItems} = useQuery({
    queryKey: LISTITEMS,
    queryFn: () =>
      client(LISTITEMS, {token: user.token}).then((data) => data.listItems),
  })
  const listItem = listItems?.find((li) => li.bookId === bookId) ?? null

  const {title, author, coverImageUrl, publisher, summary} = book

  return (
    <div>
      <div
        css={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
          gridGap: '2em',
          marginBottom: '1em',
          [mq.small]: {
            display: 'flex',
            flexDirection: 'column',
          },
        }}>
        <BookItemCover coverImageUrl={coverImageUrl} title={title} />
        <div>
          <div css={{display: 'flex', position: 'relative'}}>
            <div css={{flex: 1, justifyContent: 'space-between'}}>
              <h1>{title}</h1>
              <div>
                <i>{author}</i>
                <span css={{marginRight: 6, marginLeft: 6}}>|</span>
                <i>{publisher}</i>
              </div>
            </div>
            <div
              css={{
                right: 0,
                color: colors.grey9,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-around',
                minHeight: 100,
              }}>
              {book.loadingBook ? null : (
                <StatusButtons user={user} book={book} />
              )}
            </div>
          </div>
          <div css={{marginTop: 10}}>
            {listItem?.finishDate ? (
              <Rating user={user} listItem={listItem} />
            ) : null}
            {listItem ? <BookItemTimeframe listItem={listItem} /> : null}
          </div>
          <br />
          <BookItemSummary summary={summary} />
        </div>
      </div>
      {!book.loadingBook && listItem ? (
        <NotesTextarea user={user} listItem={listItem} />
      ) : null}
    </div>
  )
}

function BookItemTimeframe({listItem}) {
  const timeframeLabel = listItem.finishDate ? '起止日期' : '起始日期'

  return (
    <Tooltip label={timeframeLabel}>
      <div aria-label={timeframeLabel} css={{marginTop: 6}}>
        <FiCalendar css={{marginTop: -2, marginRight: 5, width: '0.8em'}} />
        <span css={{fontSize: '0.6em'}}>
          {formatDate(listItem.startDate)}{' '}
          {listItem.finishDate ? `— ${formatDate(listItem.finishDate)}` : null}
        </span>
      </div>
    </Tooltip>
  )
}

const BookItemSummary = ({summary}) => (
  <Tooltip label="简介">
    <p
      css={{
        fontSize: '0.8em',
      }}>
      {summary}
    </p>
  </Tooltip>
)

const BookItemCover = ({coverImageUrl, title}) => (
  <Tooltip label="封面">
    <img
      src={coverImageUrl}
      alt={`${title} 封面`}
      css={{width: '100%', maxWidth: '14rem'}}
    />
  </Tooltip>
)

function NotesTextarea({listItem, user}) {
  const [mutate] = useMutation(
    (updates) =>
      client(`${LISTITEMS}/${updates.id}`, {
        method: PUT,
        data: updates,
        token: user.token,
      }),
    {onSettled: () => queryCache.invalidateQueries(LISTITEMS)},
  )
  const debouncedMutate = React.useMemo(
    () => debounceFn(mutate, {wait: 300}),
    [mutate],
  )

  function handleNotesChange(e) {
    debouncedMutate({id: listItem.id, notes: e.target.value})
  }

  return (
    <React.Fragment>
      <div>
        <label
          htmlFor="notes"
          css={{
            display: 'inline-block',
            marginRight: 10,
            marginTop: '0',
            marginBottom: '0.5rem',
          }}>
          笔记
        </label>
      </div>
      <Textarea
        id="notes"
        defaultValue={listItem.notes}
        onChange={handleNotesChange}
        css={{width: '100%', minHeight: 300}}
      />
    </React.Fragment>
  )
}
