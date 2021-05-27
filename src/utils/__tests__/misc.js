import {formatDate} from '../misc'

test('formatDate formats the date to look nice', () => {
  expect(formatDate(new Date('January 1, 1900'))).toBe('1900/01/1')
})
