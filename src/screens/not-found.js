/** @jsx jsx */
import {jsx} from '@emotion/react'
import {Link} from 'components/lib'

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
        抱歉，这里什么也没有… 去<Link to="/discover">找书</Link>
      </div>
    </div>
  )
}
