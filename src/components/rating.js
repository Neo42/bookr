/** @jsx jsx */
import {jsx} from '@emotion/react'
import * as React from 'react'
import {FiFeather} from 'react-icons/fi'
import {queryCache, useMutation} from 'react-query'
import client from 'utils/api-client'
import colors from 'styles/colors'
import {LISTITEMS, PUT} from 'constant'
import {Tooltip} from './lib'

const visuallyHiddenCSS = {
  border: '0',
  clip: 'rect(0 0 0 0)',
  height: '1px',
  margin: '-1px',
  overflow: 'hidden',
  padding: '0',
  position: 'absolute',
  width: '1px',
}

function Rating({listItem, user}) {
  const [isTabbing, setIsTabbing] = React.useState(false)
  const [update] = useMutation(
    (updates) =>
      client(`${LISTITEMS}/${updates.id}`, {
        method: PUT,
        data: updates,
        token: user.token,
      }),
    {onSettled: () => queryCache.invalidateQueries(LISTITEMS)},
  )

  React.useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Tab') {
        setIsTabbing(true)
      }
    }
    document.addEventListener('keydown', handleKeyDown, {once: true})
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const rootClassName = `list-item-${listItem.id}`

  const stars = Array.from({length: 5}).map((_, i) => {
    const ratingId = `rating-${listItem.id}-${i}`
    const ratingValue = i + 1
    return (
      <React.Fragment key={i}>
        <input
          name={rootClassName}
          type="radio"
          id={ratingId}
          value={ratingValue}
          checked={ratingValue === listItem.rating}
          onChange={() => {
            update({id: listItem.id, rating: ratingValue})
          }}
          css={[
            visuallyHiddenCSS,
            {
              [`.${rootClassName} &:checked ~ label`]: {color: colors.grey9},
              [`.${rootClassName} &:checked + label`]: {color: colors.primary},
              [`.${rootClassName} &:hover ~ label`]: {
                color: `${colors.grey9} !important`,
              },
              [`.${rootClassName} &:hover + label`]: {
                color: `${colors.primary} !important`,
              },
              [`.${rootClassName} &:focus + label svg`]: {
                outline: isTabbing
                  ? [
                      `1px solid ${colors.primary}`,
                      '-webkit-focus-ring-color auto 5px',
                    ]
                  : 'initial',
              },
            },
          ]}
        />
        <label
          htmlFor={ratingId}
          css={{
            cursor: 'pointer',
            color: listItem.rating < 0 ? colors.grey9 : colors.primary,
            margin: 0,
          }}>
          <span css={visuallyHiddenCSS}>{ratingValue} 分</span>
          <FiFeather css={{width: '16px', margin: '0 2px'}} />
        </label>
      </React.Fragment>
    )
  })

  return (
    <Tooltip label="评分">
      <div
        onClick={(e) => e.stopPropagation()}
        className={rootClassName}
        aria-label="评分"
        css={{
          display: 'inline-flex',
          alignItems: 'center',
          [`&.${rootClassName}:hover input + label`]: {
            color: colors.primary,
          },
        }}>
        <span css={{display: 'flex'}}>{stars}</span>
      </div>
    </Tooltip>
  )
}

export default Rating
