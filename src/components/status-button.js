/** @jsx jsx */
import {jsx} from '@emotion/react'
import * as React from 'react'
import {FiX, FiMinus, FiBook, FiBookOpen, FiPlus} from 'react-icons/fi'
import useAsync from 'utils/hooks'
import colors from 'styles/colors'
import {CircleButton, Spinner, Tooltip} from './lib'
import {
  useCreateListItem,
  useListItem,
  useRemoveListItem,
  useUpdateListItem,
} from 'utils/list-items'

function TooltipButton({label, highlight, onClick, icon, ...rest}) {
  const {isLoading, isError, error, run, reset} = useAsync()

  function handleClick() {
    if (isError) {
      reset()
    } else {
      run(onClick())
    }
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
  const listItem = useListItem(user, book.id)

  const [update] = useUpdateListItem(user, {throwOnError: true})
  const [create] = useCreateListItem(user, {throwOnError: true})
  const [remove] = useRemoveListItem(user, {throwOnError: true})

  return (
    <React.Fragment>
      {listItem ? (
        Boolean(listItem.finishDate) ? (
          <TooltipButton
            label="标为正在读"
            highlight={colors.highlight}
            onClick={() => update({id: listItem.id, finishDate: null})}
            {...props}
            icon={<FiBookOpen />}
          />
        ) : (
          <TooltipButton
            label="标为已读"
            highlight={colors.highlight}
            onClick={() => update({id: listItem.id, finishDate: Date.now()})}
            icon={<FiBook />}
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
