/** @jsxRuntime classic */
/** @jsx jsx */
import {cloneElement, createContext, useContext, useState} from "react"
import "@reach/dialog/styles.css"
import {jsx} from "@emotion/react"
import {CircleButton, Dialog} from "./lib"
import VisuallyHidden from "@reach/visually-hidden"

const callAll = (...fns) => (...args) => fns.forEach((fn) => fn && fn(...args))

const ModalContext = createContext()

const Modal = (props) => (
  <ModalContext.Provider value={useState(false)} {...props} />
)

const ModalDismissButton = ({children: child}) => {
  const [, setIsOpen] = useContext(ModalContext)
  return cloneElement(child, {
    onClick: callAll(() => setIsOpen(false), child.props.onClick),
  })
}

const ModalOpenButton = ({children: child}) => {
  const [, setIsOpen] = useContext(ModalContext)
  return cloneElement(child, {
    onClick: callAll(() => setIsOpen(true), child.props.onClick),
  })
}

const ModalContentBase = (props) => {
  const [isOpen, setIsOpen] = useContext(ModalContext)
  return (
    <Dialog isOpen={isOpen} onDismiss={() => setIsOpen(false)} {...props} />
  )
}

const ModalContents = ({title, children, ...props}) => {
  return (
    <ModalContentBase {...props}>
      <div css={{display: "flex", justifyContent: "flex-end"}}>
        <ModalDismissButton>
          <CircleButton>
            <VisuallyHidden>关闭</VisuallyHidden>
            <span aria-hidden>×</span>
          </CircleButton>
        </ModalDismissButton>
      </div>
      <h3 css={{textAlign: "center", fontSize: "2em"}}>{title}</h3>
      {children}
    </ModalContentBase>
  )
}

export {
  Modal,
  ModalDismissButton,
  ModalOpenButton,
  ModalContentBase,
  ModalContents,
}
