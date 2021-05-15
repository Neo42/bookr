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
          color: colors.text,
          padding: '1.25em',
          borderRadius: '0.2em',
          textDecoration: 'none',
          transition: '0.2s',
          ':hover,:focus': {
            transform: 'translateY(-5px) scale(1.005) translateZ(0)',
            boxShadow: '0 2px 10px 0px rgba(0,0,0,0.4)',
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
          <div css={{display: 'flex', justifyContent: 'space-between'}}>
            <div css={{flex: 1}}>
              <h2
                id={id}
                css={{
                  fontSize: '1.25em',
                  fontWeight: 700,
                  margin: '0',
                  color: colors.secondary,
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
