import styled from "@emotion/styled"
import {Dialog as ReachDialog} from "@reach/dialog"
import SyncLoader from "react-spinners/SyncLoader"
import {black, primary, secondary, white} from "../tokens/colors"

const loaderVariants = {
  primary,
  secondary,
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
    background: primary,
    color: black,
  },
  secondary: {
    background: secondary,
    color: white,
  },
}

const Button = styled.button(
  {
    padding: `0.75em 1.5em`,
    lineHeight: 1,
    border: "none",
    borderRadius: "0.3em",
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
  background: white,
  color: black,
  border: `1px solid rgb(241, 241, 244)`,
  cursor: "pointer",
})

const Input = styled.input({
  borderRadius: "3px",
  border: `1px solid rgb(241, 241, 244)`,
  background: `rgb(241, 242, 247)`,
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
  boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.2)",
  margin: "20vh auto",
  "@media (max-width: 991px)": {
    width: "100%",
    margin: "10vh auto",
  },
})

export {Button, Loader, CircleButton, Dialog, Input, FormGroup}
