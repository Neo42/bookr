/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from "react"
import ReactDOM from "react-dom"
import "bootstrap/dist/css/bootstrap-reboot.css"
import {jsx} from "@emotion/react"
import {Logo} from "./components/logo"
import {Button, FormGroup, Input, Loader} from "./components/lib"
import {Modal, ModalContents, ModalOpenButton} from "./components/modal"

function LoginForm({onSubmit, submitButton, loader}) {
  const handleSubmit = (event) => {
    event.preventDefault()
    const [username, password] = Array.from(event.target.elements).map(
      ({value}) => value
    )
    onSubmit({username, password})
  }

  return (
    <form
      css={{
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        "> div": {
          margin: "10px auto",
          width: "100%",
          maxWidth: "300px",
        },
      }}
      onSubmit={handleSubmit}>
      <FormGroup>
        <label htmlFor="username">用户名</label>
        <Input id="username" />
      </FormGroup>
      <FormGroup>
        <label htmlFor="password">密码</label>
        <Input id="password" type="password" />
      </FormGroup>
      <div>
        {React.cloneElement(submitButton, {type: "submit"})}
        {loader}
      </div>
    </form>
  )
}

const App = () => {
  const handleSubmit = (fieldName) => (formData) =>
    console.log(fieldName, formData)

  return (
    <div
      css={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        width: "100%",
        height: "100vh",
      }}>
      <Logo width="80" height="80" />
      <h1>簿客</h1>
      <div
        css={{
          display: "grid",
          gap: `0.75rem`,
          gridTemplateColumns: `repeat(2, minmax(0px, 1fr))`,
        }}>
        <Modal>
          <ModalOpenButton>
            <Button variant="primary">登录</Button>
          </ModalOpenButton>
          <ModalContents aria-label="登录表单" title="登录">
            <LoginForm
              onSubmit={handleSubmit("登录")}
              submitButton={<Button variant="primary">登录</Button>}
              loader={<Loader variant="primary">登录</Loader>}
            />
          </ModalContents>
        </Modal>
        <Modal>
          <ModalOpenButton>
            <Button variant="secondary">注册</Button>
          </ModalOpenButton>
          <ModalContents aria-label="注册表单" title="注册">
            <LoginForm
              onSubmit={handleSubmit("注册")}
              submitButton={<Button variant="secondary">注册</Button>}
              loader={<Loader variant="secondary">注册</Loader>}
            />
          </ModalContents>
        </Modal>
      </div>
    </div>
  )
}

ReactDOM.render(<App />, document.querySelector("#root"))

if (module.hot) {
  module.hot.accept()
}
