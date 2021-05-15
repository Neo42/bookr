/** @jsx jsx */
import {jsx} from '@emotion/react'
import React from 'react'
import * as mq from './styles/media-queries'
import DiscoverScreen from './screens/discover'
import BookScreen from './screens/book'
import NotFoundScreen from './screens/not-found'
import {Button} from './components/lib'
import * as colors from './styles/colors'
import {Routes, Route, Link} from 'react-router-dom'

export default function AuthorizedApp({user, logout}) {
  const {username} = user
  return (
    <React.Fragment>
      <div
        css={{
          display: 'flex',
          alignItems: 'center',
          position: 'absolute',
          top: '1.2em',
          right: '2.5em',
        }}>
        {username}
        <Button variant="secondary" css={{marginLeft: '1em'}} onClick={logout}>
          退出登录
        </Button>
      </div>
      <div
        css={{
          background: colors.base,
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
        <div css={{position: 'relative'}}>
          <Nav />
        </div>
        <main css={{width: '100%'}}>
          <AppRoutes user={user} />
        </main>
      </div>
    </React.Fragment>
  )
}

function Nav() {
  return (
    <nav
      css={{
        position: 'sticky',
        top: '64px',
        padding: '1em 1.5em',
        border: `1px solid ${colors.gray10}`,
        borderRadius: '0.15em',
        [mq.small]: {
          position: 'static',
          top: 'auto',
        },
      }}>
      <ul
        css={{
          listStyle: 'none',
          padding: '0',
        }}>
        <li>
          <NavLink to="/discover">发现</NavLink>
        </li>
      </ul>
    </nav>
  )
}

function NavLink(props) {
  return (
    <Link
      css={{
        display: 'block',
        padding: '8px 15px',
        margin: '5px 0',
        width: '100%',
        height: '100%',
        color: colors.text,
        borderRadius: '0.2em',
        borderLeft: '0.8em solid transparent',
        textDecoration: 'none',
        transition: 'ease 0.3s',
        ':hover': {
          color: colors.gray80,
          textDecoration: 'none',
          background: colors.primary,
        },
      }}
      {...props}
    />
  )
}

function AppRoutes({user}) {
  return (
    <Routes>
      <Route path="/discover" element={<DiscoverScreen user={user} />} />
      <Route path="/book/:bookId" element={<BookScreen user={user} />} />
      <Route path="*" element={<NotFoundScreen />} />
    </Routes>
  )
}
