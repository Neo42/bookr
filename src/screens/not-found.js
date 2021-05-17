/** @jsx jsx */
import {jsx} from '@emotion/react'
import {Link} from 'react-router-dom'
import * as colors from '../styles/colors'

export default function NotFoundScreen() {
  return (
    <div
      css={{
        height: '100%',
        display: 'grid',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <div>
        抱歉，这里什么也没有…{' '}
        <Link
          to="/discover"
          css={{
            color: colors.secondary,
            textDecoration: 'none',
            fontWeight: 600,
            transition: '0.25s',
            ':hover': {
              color: colors.secondary,
              filter: 'brightness(1.2)',
            },
          }}>
          去找书
        </Link>
      </div>
    </div>
  )
}
