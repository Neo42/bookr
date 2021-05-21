/** @jsx jsx */
import {jsx} from '@emotion/react'

import * as React from 'react'
import {useParams} from 'react-router-dom'
import client from 'utils/api-client'
import mq from 'styles/media-queries'
import bookPlaceholderSvg from 'assets/placeholder.svg'
import colors from 'styles/colors'
import StatusButtons from 'components/status-button'
import Rating from 'components/rating'
import {useQuery} from 'react-query'
import {LISTITEMS} from 'constant'

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
        <img
          src={coverImageUrl}
          alt={`${title} book cover`}
          css={{width: '100%', maxWidth: '14rem'}}
        />
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
          </div>
          <br />
          <p>{summary}</p>
        </div>
      </div>
    </div>
  )
}
