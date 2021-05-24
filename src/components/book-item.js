/** @jsx jsx */
import {jsx} from '@emotion/react'
import {Link} from 'react-router-dom'
import mq from 'styles/media-queries'
import colors from 'styles/colors'
import StatusButtons from './status-button'
import Rating from './rating'
import {useListItem} from 'utils/list-items'

export default function BookItem({book}) {
  const {title, author, coverImageUrl} = book
  const id = `book-item-book-${book.id}`
  const listItem = useListItem(book.id)

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
            boxShadow: '0 30px 60px rgba(0,0,0,0.12)',
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
            css={{
              maxHeight: '100%',
              width: '100%',
              boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
              borderRadius: 5,
            }}
          />
        </div>
        <div css={{flex: 1}}>
          <div
            css={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '1em',
            }}>
            <div css={{flex: 1}}>
              <h2
                id={id}
                css={{
                  fontSize: '1.25em',
                  fontWeight: 700,
                  marginBottom: '0.5em',
                  color: colors.primary,
                  lineHeight: '1.2em',
                }}>
                {title}
              </h2>
              {listItem?.finishDate ? <Rating listItem={listItem} /> : null}
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
      <div
        css={{
          marginLeft: '20px',
          position: 'absolute',
          right: -20,
          color: colors.primary,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-around',
          height: '100%',
        }}>
        <StatusButtons book={book} />
      </div>
    </div>
  )
}
