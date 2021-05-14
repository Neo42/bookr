/** @jsx jsx */
import {jsx, keyframes} from '@emotion/react'
import styled from '@emotion/styled'
import {Dialog as ReachDialog} from '@reach/dialog'
import {Link as RouterLink} from 'react-router-dom'
import {ImSpinner2 as RawSpinner} from 'react-icons/im'
import * as colors from '../styles/colors'
import * as mq from '../styles/media-queries'

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
    background: colors.primary,
    color: colors.text,
  },
  secondary: {
    background: colors.secondary,
    color: colors.base,
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
    padding: `0.75em 1.5em`,
    lineHeight: 1,
    borderRadius: '0.2em',
    border: 'none',
    transition: 'ease 0.3s',
    ':hover': {
      filter: 'brightness(1.06)',
    },
  },
  ({variant = 'primary'}) => buttonVariants[variant]
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
  background: colors.base,
  color: colors.text,
  border: `1px solid ${colors.gray10}`,
  cursor: 'pointer',
  transition: 'ease 0.3s',
  ':hover': {
    filter: 'brightness(0.97)',
  },
})

const Input = styled.input(({variant = 'primary'}) => ({
  borderRadius: '3',
  border: `1px solid ${colors.gray10}`,
  background: colors.gray,
  padding: `8px 12px`,
  ':focus': {
    outlineColor: variant === 'primary' ? colors.primary : colors.secondary,
  },
}))

const FormGroup = styled.div({
  display: `flex`,
  flexDirection: 'column',
})

const Dialog = styled(ReachDialog)({
  maxWidth: 450,
  borderRadius: 3,
  paddingBottom: '3.5em',
  boxShadow: `0 10px 30px -5px rgba(0, 0, 0, 0.2)`,
  margin: '20vh auto',
  [mq.small]: {
    width: '100%',
    margin: '10vh auto',
  },
})

const Link = styled(RouterLink)({
  color: colors.primary,
  ':hover': {
    filter: 'brightness(0.97)',
    textDecoration: 'underline',
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
    <span>出错了：</span>
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

export {
  FullPageFallback,
  Link,
  Input,
  Button,
  CircleButton,
  Dialog,
  FormGroup,
  Spinner,
  FullPageSpinner,
  BookListUL,
  ErrorMessage,
}
