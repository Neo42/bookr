import * as React from 'react'
import userEvent from '@testing-library/user-event'
import {render, screen, within} from '@testing-library/react'
import {Modal, ModalContents, ModalOpenButton} from '../modal'

test(`can be opened and closed.`, () => {
  const label = 'Modal Label'
  const title = 'Modal Title'
  const content = 'Modal Content'

  const button = 'button'
  const heading = 'heading'
  const dialog = 'dialog'
  const ariaLabel = 'aria-label'

  render(
    <Modal>
      <ModalOpenButton>
        <button>打开</button>
      </ModalOpenButton>
      <ModalContents aria-label={label} title={title}>
        <div>{content}</div>
      </ModalContents>
    </Modal>,
  )
  userEvent.click(screen.getByRole(button, {name: /打开/i}))

  const modal = screen.getByRole(dialog)
  expect(modal).toHaveAttribute(ariaLabel, label)
  const inModal = within(modal)
  expect(inModal.getByRole(heading, {name: title})).toBeInTheDocument()
  expect(inModal.getByText(content)).toBeInTheDocument()

  userEvent.click(screen.getByRole(button, {name: /关闭/i}))
  expect(screen.queryByRole(dialog)).not.toBeInTheDocument()
})
