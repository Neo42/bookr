/** @jsx jsx */
import {jsx} from '@emotion/react'
import {BookListUL} from './lib'
import BookItem from './book-item'
import {useListItems} from 'utils/list-items'
import Profiler from './profiler'

function BookList({filterListItems, noListItems, noFilteredListItems}) {
  const listItems = useListItems()
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
    <Profiler
      id="Book List 组件"
      metaData={{listItemCount: filterListItems.length}}>
      <BookListUL>
        {filteredListItems.map((listItem) => (
          <li key={listItem.id}>
            <BookItem book={listItem.book} />
          </li>
        ))}
      </BookListUL>
    </Profiler>
  )
}

export default BookList
