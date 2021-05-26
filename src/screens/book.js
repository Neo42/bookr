/** @jsx jsx */
import {jsx} from '@emotion/react'
import * as React from 'react'
import Tilt from 'react-parallax-tilt'
import debounceFn from 'debounce-fn'
import {useParams} from 'react-router-dom'
import {FiCalendar} from 'react-icons/fi'
import mq from 'styles/media-queries'
import colors from 'styles/colors'
import StatusButtons from 'components/status-button'
import Rating from 'components/rating'
import {ErrorMessage, Textarea, Tooltip} from 'components/lib'
import {formatDate} from 'utils/misc'
import {useBook} from 'utils/books'
import {useListItem, useUpdateListItem} from 'utils/list-items'
import Profiler from 'components/profiler'

export default function BookScreen() {
  const {bookId} = useParams()
  const book = useBook(bookId)
  const listItem = useListItem(bookId)
  const {title, author, coverImageUrl, publisher, summary} = book

  return (
    <Profiler id="Book Screen" metaData={{bookId, listItemId: listItem?.id}}>
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
                {book.loadingBook ? null : <StatusButtons book={book} />}
              </div>
            </div>
            <div css={{marginTop: 10}}>
              {listItem?.finishDate ? <Rating listItem={listItem} /> : null}
              {listItem ? <BookItemTimeframe listItem={listItem} /> : null}
            </div>
            <br />
            <BookItemSummary summary={summary} />
          </div>
        </div>
        {!book.loadingBook && listItem ? (
          <NotesTextarea listItem={listItem} />
        ) : null}
      </div>
    </Profiler>
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
  <p
    css={{
      fontSize: '0.8em',
    }}>
    {summary}
  </p>
)

const BookItemCover = ({coverImageUrl, title}) => (
  <Tilt
    css={{height: 'fit-content'}}
    tiltReverse
    gyroscope
    scale={1.1}
    transitionSpeed={2000}
    tiltMaxAngleX={10}
    tiltMaxAngleY={10}>
    <img
      src={coverImageUrl}
      alt={`${title} 封面`}
      css={{
        width: '100%',
        maxWidth: '14rem',
        transition: '2s',
        boxShadow: '0 5px 10px rgba(0,0,0,0.12)',
        ':hover': {
          boxShadow: '0 30px 60px rgba(0,0,0,0.12)',
        },
        borderRadius: 10,
      }}
    />
  </Tilt>
)

function NotesTextarea({listItem}) {
  const [mutate, {error, isError}] = useUpdateListItem()
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
            fontWeight: 'bold',
          }}>
          笔记
        </label>
      </div>
      {isError ? (
        <ErrorMessage
          error={error}
          variant="inline"
          css={{marginLeft: 6, fontSize: '0.7em'}}
        />
      ) : null}
      <Textarea
        id="notes"
        defaultValue={listItem.notes}
        onChange={handleNotesChange}
        css={{width: '100%', minHeight: 300, fontSize: 14, lineHeight: 1.7}}
        placeholder="写点什么…"
      />
    </React.Fragment>
  )
}
