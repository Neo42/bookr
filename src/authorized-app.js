/** @jsx jsx */
import {jsx} from '@emotion/react'
import React from 'react'
import * as mq from './styles/media-queries'
import {Button} from './components/lib'
import DiscoverScreen from './discover'

export default function AuthorizedApp({user: username, logout}) {
  return (
    <React.Fragment>
      <div
        css={{
          display: 'flex',
          alignItems: 'center',
          position: 'absolute',
          top: '10px',
          right: '10px',
        }}>
        {username}
        <Button
          variant="secondary"
          css={{marginRight: '10px'}}
          onClick={logout}>
          退出登录
        </Button>
      </div>
      <div
        css={{
          margin: '0 auto',
          padding: '4em 2em',
          maxWidth: '840px',
          width: '100%',
          display: 'grid',
          gap: '1em',
          gridTemplateColumns: '1fr 3fr',
          [mq.small]: {
            gridTemplateColumns: '1fr',
            gridTemplateRows: 'auto',
            width: '100%',
          },
        }}>
        <DiscoverScreen />
      </div>
    </React.Fragment>
  )
}
