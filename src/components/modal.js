/** @jsx jsx */
import * as React from 'react'
import {jsx} from '@emotion/react'
import VisuallyHidden from '@reach/visually-hidden'
import {CircleButton, Dialog} from './lib'

const callAll =
  (...fns) =>
  (...args) =>
    fns.forEach((fn) => fn && fn(...args))

const ModalContext = React.createContext()

const Modal = (props) => (
  <ModalContext.Provider value={React.useState(false)} {...props} />
)

const ModalDismissButton = ({children: child}) => {
  const [, setIsOpen] = React.useContext(ModalContext)
  return React.cloneElement(child, {
    onClick: callAll(() => setIsOpen(false), child.props.onClick),
  })
}

const ModalOpenButton = ({children: child}) => {
  const [, setIsOpen] = React.useContext(ModalContext)
  return React.cloneElement(child, {
    onClick: callAll(() => setIsOpen(true), child.props.onClick),
  })
}

const ModalContentBase = (props) => {
  const [isOpen, setIsOpen] = React.useContext(ModalContext)
  return (
    <Dialog isOpen={isOpen} onDismiss={() => setIsOpen(false)} {...props} />
  )
}

const ModalContents = ({title, children, ...props}) => {
  return (
    <ModalContentBase {...props}>
      <div css={{display: 'flex', justifyContent: 'flex-end'}}>
        <ModalDismissButton>
          <CircleButton>
            <VisuallyHidden>关闭</VisuallyHidden>
            <span aria-hidden>×</span>
          </CircleButton>
        </ModalDismissButton>
      </div>
      <h3 css={{textAlign: 'center', fontSize: '2em'}}>{title}</h3>
      {children}
    </ModalContentBase>
  )
}

export {Modal, ModalDismissButton, ModalOpenButton, ModalContents}
