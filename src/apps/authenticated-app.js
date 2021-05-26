/** @jsx jsx */
import {jsx} from '@emotion/react'
import React from 'react'
import {Routes, Route, Link, useMatch} from 'react-router-dom'
import {FiBook, FiBookOpen, FiSearch} from 'react-icons/fi'
import {ErrorBoundary} from 'react-error-boundary'
import {Button, ErrorMessage, FullPageFallback} from 'components/lib'
import colors from 'styles/colors'
import mq from 'styles/media-queries'
import {useAuth} from 'auth/context'

const ReadingScreen = React.lazy(() =>
  import(/* webpackPrefetch: true */ 'screens/reading'),
)
const ReadScreen = React.lazy(() =>
  import(/* webpackPrefetch: true */ 'screens/read'),
)
const DiscoverScreen = React.lazy(() =>
  import(/* webpackPrefetch: true */ 'screens/discover'),
)
const BookScreen = React.lazy(() => import('screens/book'))
const NotFoundScreen = React.lazy(() => import('screens/not-found'))

function ErrorFallback({error}) {
  return (
    <ErrorMessage
      error={error}
      css={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    />
  )
}
export default function AuthorizedApp() {
  const {user, logout} = useAuth()
  const {username} = user
  return (
    <ErrorBoundary FallbackComponent={FullPageFallback}>
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
          gap: '2em',
          gridTemplateColumns: '1fr 10fr',
          [mq.small]: {
            gridTemplateColumns: '1fr',
            gridTemplateRows: 'auto',
            width: '100%',
            gap: '1.5em',
          },
        }}>
        <div css={{position: 'relative'}}>
          <Nav />
        </div>
        <main css={{width: '100%'}}>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <AppRoutes />
          </ErrorBoundary>
        </main>
      </div>
    </ErrorBoundary>
  )
}

function Nav() {
  return (
    <nav
      css={{
        borderRight: `1px solid ${colors.border}`,
        position: 'sticky',
        top: '64px',
        padding: '0.5em 0.8em',
        borderRadius: '0.15em',
        [mq.small]: {
          position: 'static',
          top: 'auto',
          borderRight: 'none',
          borderBottom: `1px solid ${colors.border}`,
        },
      }}>
      <ul
        css={{
          listStyle: 'none',
          padding: '0',
          [mq.small]: {
            display: 'flex',
            justifyContent: 'space-around',
            margin: 0,
          },
        }}>
        <li>
          <NavLink to="/reading" title="正在读">
            <FiBookOpen />
          </NavLink>
        </li>
        <li>
          <NavLink to="/read" title="已读">
            <FiBook />
          </NavLink>
        </li>
        <li>
          <NavLink to="/discover" title="发现">
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
            color: colors.grey6,
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

function AppRoutes() {
  return (
    <React.Suspense>
      <Routes>
        <Route path="/reading" element={<ReadingScreen />} />
        <Route path="/read" element={<ReadScreen />} />
        <Route path="/discover" element={<DiscoverScreen />} />
        <Route path="/book/:bookId" element={<BookScreen />} />
        <Route path="*" element={<NotFoundScreen />} />
      </Routes>
    </React.Suspense>
  )
}
