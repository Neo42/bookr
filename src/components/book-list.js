/** @jsx jsx */
import {jsx} from '@emotion/react'
import {BookListUL} from './lib'
import BookItem from './book-item'
import {useListItems} from 'utils/list-items'

function BookList({user, filterListItems, noListItems, noFilteredListItems}) {
  const listItems = useListItems(user)
  const filteredListItems = listItems?.filter(filterListItems)

  if (!listItems?.length) {
    return <div css={{marginTop: '1em', fontSize: '1em'}}>{noListItems}</div>
  }
  if (!filteredListItems.length) {
    return (
      <div css={{marginTop: '1em', fontSize: '1em'}}>{noFilteredListItems}</div>
    )
  }

  return (
    <BookListUL>
      {filteredListItems.map((listItem) => (
        <li key={listItem.id}>
          <BookItem user={user} book={listItem.book} />
        </li>
      ))}
    </BookListUL>
  )
}

export default BookList
