import * as React from 'react'
import {Link} from 'components/lib'
import BookList from 'components/book-list'

function ReadScreen({user}) {
  return (
    <BookList
      user={user}
      filterListItems={(li) => Boolean(li.finishDate)}
      noListItems={
        <p>
          这里什么也没有…
          <br />
          <Link to="/">去正在读的书单</Link>
        </p>
      }
      noFilteredListItems={
        <p>
          还没有读完一本正在读的书
          <br />
          <Link to="/list">去正在读的书单</Link>或者
          <Link to="/discover">去找书</Link>.
        </p>
      }
    />
  )
}

export default ReadScreen
