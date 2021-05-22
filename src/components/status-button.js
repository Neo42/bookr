/** @jsx jsx */
import {jsx} from '@emotion/react'
import * as React from 'react'
import {useMutation, useQuery, queryCache} from 'react-query'
import {FiX, FiMinus, FiBook, FiBookOpen, FiPlus} from 'react-icons/fi'
import client from 'utils/api-client'
import useAsync from 'utils/hooks'
import colors from 'styles/colors'
import {CircleButton, Spinner, Tooltip} from './lib'
import {LISTITEMS, DELETE, PUT} from 'consts'

function TooltipButton({label, highlight, onClick, icon, ...rest}) {
  const {isLoading, isError, error, run} = useAsync()

  function handleClick() {
    run(onClick())
  }

  return (
    <Tooltip label={isError ? error.message : label}>
      <CircleButton
        css={{
          boxShadow: '0 30px 60px rgba(0,0,0,0.12)',
          transition: '0.25s',
          backgroundColor: 'white',
          ':hover,:focus': {
            boxShadow: '0 5px 10px rgba(0,0,0,0.12)',
            color: isLoading
              ? colors.grey9
              : isError
              ? colors.danger
              : highlight,
          },
        }}
        disabled={isLoading}
        onClick={handleClick}
        aria-label={isError ? error.message : label}
        {...rest}>
        {isLoading ? <Spinner /> : isError ? <FiX /> : icon}
      </CircleButton>
    </Tooltip>
  )
}

function StatusButtons({user, book, ...props}) {
  const {data: listItems} = useQuery({
    queryKey: LISTITEMS,
    queryFn: () =>
      client(LISTITEMS, {token: user.token}).then(({listItems}) => listItems),
  })

  const listItem = listItems?.find((li) => li.bookId === book.id) ?? null

  const [create] = useMutation(
    ({bookId}) => client(LISTITEMS, {data: {bookId}, token: user.token}),
    {onSettled: () => queryCache.invalidateQueries(LISTITEMS)},
  )
  const [update] = useMutation(
    (updates) =>
      client(`${LISTITEMS}/${updates.id}`, {
        method: PUT,
        data: updates,
        token: user.token,
      }),
    {onSettled: () => queryCache.invalidateQueries(LISTITEMS)},
  )
  const [remove] = useMutation(
    ({id}) => client(`${LISTITEMS}/${id}`, {method: DELETE, token: user.token}),
    {onSettled: () => queryCache.invalidateQueries(LISTITEMS)},
  )

  return (
    <React.Fragment>
      {listItem ? (
        Boolean(listItem.finishDate) ? (
          <TooltipButton
            label="标为正在读"
            highlight={colors.highlight}
            onClick={() => update({id: listItem.id, finishDate: null})}
            icon={<FiBook />}
            {...props}
          />
        ) : (
          <TooltipButton
            label="标为已读"
            highlight={colors.highlight}
            onClick={() => update({id: listItem.id, finishDate: Date.now()})}
            icon={<FiBookOpen />}
            {...props}
          />
        )
      ) : null}
      {listItem ? (
        <TooltipButton
          label="移除"
          highlight={colors.danger}
          icon={<FiMinus />}
          onClick={() => remove({id: listItem.id})}
          {...props}
        />
      ) : (
        <TooltipButton
          label="标为正在读"
          highlight={colors.highlight}
          onClick={() => create({bookId: book.id})}
          icon={<FiPlus />}
          {...props}
        />
      )}
    </React.Fragment>
  )
}

export default StatusButtons
