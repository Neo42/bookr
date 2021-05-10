import bookData from "./booksData.json"
import {matchSorter} from "match-sorter"

let books = [...bookData]

async function create(book) {
  books.push(book)
  return book
}

async function read(bookId) {
  return books.find(({id}) => id === bookId)
}

async function query(search) {
  return matchSorter(books, search, {
    keys: [
      "title",
      "author",
      "publisher",
      {threshold: matchSorter.rankings.CONTAINS, key: "summary"},
    ],
  })
}

async function readManyNotInList(ids) {
  return books.filter(({id}) => !ids.includes(id))
}

async function reset() {}

export {create, query, read, readManyNotInList, reset}
