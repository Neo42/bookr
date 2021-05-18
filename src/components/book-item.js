/** @jsx jsx */
import {jsx} from '@emotion/react'
import {Link} from 'react-router-dom'
import * as mq from '../styles/media-queries'
import * as colors from '../styles/colors'

export default function BookItem({book}) {
  const {title, author, coverImageUrl} = book

  const id = `book-item-book-${book.id}`

  return (
    <div
      css={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        position: 'relative',
      }}>
      <Link
        to={`/book/${book.id}`}
        aria-labelledby={id}
        css={{
          minHeight: 270,
          flexGrow: 2,
          display: 'grid',
          gridTemplateColumns: '140px 1fr',
          gridGap: 20,
          border: `none`,
          color: colors.primary,
          padding: '1.25em',
          borderRadius: '5px',
          textDecoration: 'none',
          boxShadow: '0 5px 10px rgba(0,0,0,0.12)',
          transition: '0.25s',
          ':hover,:focus': {
            boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
            color: 'inherit',
          },
        }}>
        <div
          css={{
            width: 140,
            [mq.small]: {
              width: 100,
            },
          }}>
          <img
            src={coverImageUrl}
            alt={`${title} book cover`}
            css={{maxHeight: '100%', width: '100%'}}
          />
        </div>
        <div css={{flex: 1}}>
          <div
            css={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '1.5em',
            }}>
            <div css={{flex: 1}}>
              <h2
                id={id}
                css={{
                  fontSize: '1.25em',
                  fontWeight: 700,
                  margin: '0',
                  color: colors.primary,
                  lineHeight: '1.2em',
                }}>
                {title}
              </h2>
            </div>
            <div css={{marginLeft: 10}}>
              <div
                css={{
                  marginTop: '0.4em',
                  fontStyle: 'italic',
                  fontSize: '80%',
                }}>
                {author}
              </div>
              <small>{book.publisher}</small>
            </div>
          </div>
          <small
            css={{
              whiteSpace: 'break-spaces',
              display: 'block',
              fontSize: '80%',
            }}>
            {book.summary.split(' ').slice(0, 70).join(' ')}...
          </small>
        </div>
      </Link>
    </div>
  )
}
