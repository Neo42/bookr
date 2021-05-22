import * as React from 'react'
import {Link} from 'components/lib'
import BookList from 'components/book-list'

function ReadingListScreen({user}) {
  return (
    <BookList
      user={user}
      filterListItems={(li) => !li.finishDate}
      noListItems={
        <p>
          这里一本书也没有…
          <br />
          <Link to="/discover">去找书</Link>
        </p>
      }
      noFilteredListItems={
        <p>
          书单里的书都读完了
          <br />去<Link to="/finished">已读书单</Link>查看或者去
          <Link to="/discover">找书</Link>.
        </p>
      }
    />
  )
}

export default ReadingListScreen
