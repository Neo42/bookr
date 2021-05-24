import * as React from 'react'
import {Link} from 'components/lib'
import BookList from 'components/book-list'

function ReadScreen() {
  return (
    <BookList
      filterListItems={(li) => Boolean(li.finishDate)}
      noListItems={
        <p>
          这里什么也没有…
          <br />去<Link to="/">正在读的书单</Link>
        </p>
      }
      noFilteredListItems={
        <p>
          还没有读完一本正在读的书
          <br />去<Link to="/reading">正在读的书单</Link>或者去
          <Link to="/discover">找书</Link>.
        </p>
      }
    />
  )
}

export default ReadScreen
