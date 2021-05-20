/** @jsx jsx */
import {jsx} from '@emotion/react'
import React from 'react'
import {Routes, Route, Link, useMatch} from 'react-router-dom'
import {FiSearch} from 'react-icons/fi'
import * as mq from './styles/media-queries'
import DiscoverScreen from './screens/discover'
import BookScreen from './screens/book'
import NotFoundScreen from './screens/not-found'
import {Button} from './components/lib'
import colors from './styles/colors'

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
          right: '2em',
        }}>
        {username}
        <Button variant="secondary" css={{marginLeft: '1em'}} onClick={logout}>
          退出登录
        </Button>
      </div>
      <div
        css={{
          background: colors.secondary,
          margin: '0 auto',
          padding: '4.5em 2em',
          maxWidth: '840px',
          width: '100%',
          display: 'grid',
          gap: '2.5em',
          gridTemplateColumns: '1fr 5fr',
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
        borderLeft: `1px solid ${colors.border}`,
        position: 'sticky',
        top: '64px',
        padding: '0.5em 0.8em',
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
          <NavLink to="/discover">
            <FiSearch />
          </NavLink>
        </li>
      </ul>
    </nav>
  )
}

function NavLink(props) {
  const match = useMatch(props.to)
  return (
    <Link
      css={[
        {
          textAlign: 'center',
          fontWeight: 300,
          display: 'block',
          padding: '8px 15px',
          margin: '5px 0',
          width: '100%',
          height: '100%',
          color: colors.primary,
          textDecoration: 'none',
          transition: 'ease 0.25s',
          ':hover': {
            color: colors.grey4,
          },
        },
        match
          ? {
              fontWeight: 400,
            }
          : null,
      ]}
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
