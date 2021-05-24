/** @jsx jsx */
import {jsx, keyframes} from '@emotion/react'
import styled from '@emotion/styled'
import {Dialog as ReachDialog} from '@reach/dialog'
import {FiLoader as RawSpinner} from 'react-icons/fi'
import {Tooltip as ReachTooltip} from '@reach/tooltip'
import {Link as RouterLink} from 'react-router-dom'
import colors from 'styles/colors'
import mq from 'styles/media-queries'

const spin = keyframes({
  '0%': {transform: 'rotate(0deg)'},
  '100%': {transform: 'rotate(360deg)'},
})

const Spinner = styled(RawSpinner)({
  animation: `${spin} 0.15s linear infinite`,
})

Spinner.defaultProps = {
  'aria-label': '加载中',
}

function FullPageSpinner() {
  return (
    <div
      css={{
        fontSize: '4em',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Spinner />
    </div>
  )
}

const buttonVariants = {
  primary: {
    color: colors.secondary,
    background: colors.primary,
    border: `solid 1px ${colors.primary}`,
    ':hover': {
      color: colors.primary,
      background: colors.secondary,
    },
  },
  secondary: {
    border: 'solid 1px #eaeaea',
    background: colors.secondary,
    ':hover': {
      borderColor: colors.primary,
    },
  },
}

const Button = styled.button(
  {
    boxSizing: 'border-box',
    display: 'flex',
    minWidth: '6.5em',
    width: 'content-width',
    alignItems: 'center',
    justifyContent: 'center',
    padding: `0.6em`,
    lineHeight: 1,
    borderRadius: '0.2em',
    transition: 'ease 0.25s',
  },
  ({variant = 'primary'}) => buttonVariants[variant],
)

const CircleButton = styled.button({
  borderRadius: 30,
  padding: 0,
  width: 40,
  height: 40,
  lineHeight: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: colors.secondary,
  color: colors.primary,
  border: `1px solid ${colors.border}`,
  cursor: 'pointer',
  transition: 'ease 0.25s',
  ':hover': {
    filter: 'brightness(0.99)',
  },
})

const inputStyles = {
  borderRadius: '5px',
  border: `1px solid ${colors.border}`,
  background: colors.secondary,
  padding: `8px 12px`,
  transition: '0.25s',
  outline: 'none',
  ':focus': {
    borderColor: colors.primary,
  },
}

const Input = styled.input(inputStyles)
const Textarea = styled.textarea(inputStyles)

const FormGroup = styled.div({
  display: `flex`,
  flexDirection: 'column',
})

const Dialog = styled(ReachDialog)({
  maxWidth: 450,
  borderRadius: '0.2em',
  paddingBottom: '3.5em',
  boxShadow: `0 10px 30px -5px rgba(0, 0, 0, 0.2)`,
  margin: '20vh auto',
  [mq.small]: {
    width: '100%',
    margin: '10vh auto',
  },
})

const BookListUL = styled.ul({
  listStyle: 'none',
  padding: 0,
  display: 'grid',
  gridTemplateRows: 'repeat(auto-fill, minmax(100px, 1fr))',
  gap: '1em',
  background: 'transparent',
})

const errorMessageVariants = {
  stacked: {display: 'block'},
  inline: {display: 'inline-block'},
}

const ErrorMessage = ({error: {message}, variant = 'stacked', ...props}) => (
  <div
    role="alert"
    css={[{color: colors.danger}, errorMessageVariants[variant]]}
    {...props}>
    <span>出错了，刷新试试看~</span>
    <pre
      css={[
        {whiteSpace: 'break-spaces', margin: 0, marginBottom: -5},
        errorMessageVariants[variant],
      ]}>
      {message}
    </pre>
  </div>
)

const FullPageFallback = ({error: {message}}) => (
  <div
    role="alert"
    css={{
      color: colors.danger,
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
    <p>Emm…没加载出来…麻烦帮我刷新一下页面</p>
    <pre>{message}</pre>
  </div>
)

const Tooltip = styled(ReachTooltip)({
  padding: '0.5em',
  backgroundColor: colors.primary,
  color: colors.secondary,
  borderRadius: '5px',
})

const Link = styled(RouterLink)({
  color: colors.primary,
  textDecoration: 'underline',
  transition: '0.25s',
  ':hover': {
    color: colors.primary,
    filter: 'brightness(1.2)',
    textDecoration: 'none',
  },
})

export {
  FullPageFallback,
  Input,
  Textarea,
  Button,
  CircleButton,
  Dialog,
  FormGroup,
  Spinner,
  FullPageSpinner,
  BookListUL,
  ErrorMessage,
  Tooltip,
  Link,
}
