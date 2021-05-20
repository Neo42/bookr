/** @jsx jsx */
import {jsx} from '@emotion/react'

import * as React from 'react'
import {useParams} from 'react-router-dom'
import client from '../utils/api-client'
import * as mq from '../styles/media-queries'
import useAsync from '../utils/hooks'
import bookPlaceholderSvg from '../assets/placeholder.svg'
import colors from '../styles/colors'
import {StatusButtons} from '../components/status-button'

const loading = {
  title: '加载中…',
  author: '加载中…',
  publisher: '加载中…',
  synopsis: '加载中…',
  loading: true,
  coverImageUrl: bookPlaceholderSvg,
}

export default function BookScreen({user}) {
  const {bookId} = useParams()
  const {data, run} = useAsync()

  React.useEffect(() => {
    run(client(`books/${bookId}`, {token: user.token}))
  }, [run, bookId, user.token])

  const book = data?.book ?? loading
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
          <br />
          <p>{summary}</p>
        </div>
      </div>
    </div>
  )
}
