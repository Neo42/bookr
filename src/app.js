/** @jsx jsx */
import {jsx} from '@emotion/react'
import './bootstrap'
import * as React from 'react'
import ReactDOM from 'react-dom'
import {Button, FormGroup, Input, Spinner} from './components/lib'
import {Modal, ModalContents, ModalOpenButton} from './components/modal'
import {Logo} from './components/logo'

function LoginForm({onSubmit, submitButton, variant}) {
  const handleSubmit = (event) => {
    event.preventDefault()
    const [{value: username}, {value: password}] = event.target.elements
    onSubmit({username, password})
  }

  return (
    <form
      css={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        '> div': {
          margin: '10px auto',
          width: '100%',
          maxWidth: '300',
        },
      }}
      onSubmit={handleSubmit}>
      <FormGroup>
        <label htmlFor="username">用户名</label>
        <Input id="username" variant={variant} />
      </FormGroup>
      <FormGroup>
        <label htmlFor="password">密码</label>
        <Input id="password" type="password" variant={variant} />
      </FormGroup>
      <div>{React.cloneElement(submitButton, {type: 'submit'})}</div>
    </form>
  )
}

const App = () => {
  const handleSubmit = (fieldName) => (formData) =>
    console.log(fieldName, formData)

  return (
    <div
      css={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        width: '100%',
        height: '100vh',
      }}>
      <Logo width="80" height="80" />
      <h1>Booker 簿客</h1>
      <div
        css={{
          display: 'grid',
          gap: `0.75rem`,
          gridTemplateColumns: `repeat(2, minmax(0px, 1fr))`,
        }}>
        <Modal>
          <ModalOpenButton>
            <Button variant="primary">登录</Button>
          </ModalOpenButton>
          <ModalContents aria-label="登录表单" title="登录">
            <LoginForm
              variant="primary"
              onSubmit={handleSubmit('登录')}
              submitButton={
                <Button variant="primary">
                  <span css={{marginRight: '0.33em'}}>登录</span>
                  <Spinner />
                </Button>
              }
            />
          </ModalContents>
        </Modal>
        <Modal>
          <ModalOpenButton>
            <Button variant="secondary">注册</Button>
          </ModalOpenButton>
          <ModalContents aria-label="注册表单" title="注册">
            <LoginForm
              variant="secondary"
              onSubmit={handleSubmit('注册')}
              submitButton={
                <Button variant="secondary">
                  <span css={{marginRight: '0.33em'}}>注册</span>
                  <Spinner />
                </Button>
              }
            />
          </ModalContents>
        </Modal>
      </div>
    </div>
  )
}

ReactDOM.render(<App />, document.querySelector('#root'))

if (module.hot) {
  module.hot.accept()
}

export default App
