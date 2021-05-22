/** @jsx jsx */
import {jsx} from '@emotion/react'
import {useQuery} from 'react-query'
import {BookListUL} from './lib'
import BookItem from './book-item'
import {LISTITEMS} from '../consts'
import client from '../utils/api-client'

function BookList({user, filterListItems, noListItems, noFilteredListItems}) {
  const {data: listItems} = useQuery({
    queryKey: LISTITEMS,
    queryFn: () =>
      client(LISTITEMS, {token: user.token}).then(({listItems}) => listItems),
  })

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
