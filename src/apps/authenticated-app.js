/** @jsx jsx */
import {jsx} from '@emotion/react'
import {Routes, Route, Link, useMatch} from 'react-router-dom'
import {FiBook, FiBookOpen, FiSearch} from 'react-icons/fi'
import {ErrorBoundary} from 'react-error-boundary'
import ReadingScreen from 'screens/reading'
import ReadScreen from 'screens/read'
import DiscoverScreen from 'screens/discover'
import BookScreen from 'screens/book'
import NotFoundScreen from 'screens/not-found'
import {Button, ErrorMessage, FullPageErrorFallback} from 'components/lib'
import colors from 'styles/colors'
import mq from 'styles/media-queries'
import {useAuth} from 'auth/context'

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
    <ErrorBoundary FallbackComponent={FullPageErrorFallback}>
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
          <NavLink to="/reading" title="未读">
            <FiBook />
          </NavLink>
        </li>
        <li>
          <NavLink to="/read" title="已读">
            <FiBookOpen />
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
          display: 'block',
          padding: '8px 15px',
          margin: '5px 0',
          width: '100%',
          height: '100%',
          color: colors.grey10,
          textDecoration: 'none',
          transition: 'ease 0.5s',
          ':hover': {
            color: colors.primary,
          },
          svg: {
            height: '1.2em',
            width: '1.2em',
          },
        },
        match
          ? {
              color: colors.primary,
            }
          : null,
      ]}
      {...props}
    />
  )
}

function AppRoutes() {
  return (
    <Routes>
      <Route element={<ReadingScreen />} />
      <Route path="/reading" element={<ReadingScreen />} />
      <Route path="/read" element={<ReadScreen />} />
      <Route path="/discover" element={<DiscoverScreen />} />
      <Route path="/book/:bookId" element={<BookScreen />} />
      <Route path="*" element={<NotFoundScreen />} />
    </Routes>
  )
}
