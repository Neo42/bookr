import styled from "@emotion/styled"
import {Dialog as ReachDialog} from "@reach/dialog"
import SyncLoader from "react-spinners/SyncLoader"
import * as colors from "../styles/colors"
import * as mq from "../styles/media-queries"

const loaderVariants = {
  primary: colors.primary,
  secondary: colors.secondary,
}

const Loader = ({variant = "primary"}) => (
  <SyncLoader
    color={loaderVariants[variant]}
    aria-label="加载中"
    size="10px"
    css={{marginLeft: "55px"}}
  />
)

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
    padding: `0.75em 1.5em`,
    lineHeight: 1,
    borderRadius: "0.2em",
    border: "none",
    transition: "ease 0.3s",
    ":hover": {
      filter: "brightness(1.06)",
    },
  },
  ({variant = "primary"}) => buttonVariants[variant]
)

const CircleButton = styled.button({
  borderRadius: "30px",
  padding: 0,
  width: "40px",
  height: "40px",
  lineHeight: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: colors.base,
  color: colors.text,
  border: `1px solid ${colors.gray10}`,
  cursor: "pointer",
  transition: "ease 0.3s",
  ":hover": {
    filter: "brightness(0.97)",
  },
})

const Input = styled.input({
  borderRadius: "3px",
  border: `1px solid ${colors.gray10}`,
  background: colors.gray,
  padding: `8px 12px`,
})

const FormGroup = styled.div({
  display: `flex`,
  flexDirection: "column",
})

const Dialog = styled(ReachDialog)({
  maxWidth: "450px",
  borderRadius: "3px",
  paddingBottom: "3.5em",
  boxShadow: `0 10px 30px -5px ${colors.boxShadow}`,
  margin: "20vh auto",
  [mq.small]: {
    width: "100%",
    margin: "10vh auto",
  },
})

export {Button, Loader, CircleButton, Dialog, Input, FormGroup}
