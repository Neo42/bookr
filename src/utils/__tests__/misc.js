import {formatDate} from '../misc'

test('formats the date correctly', () => {
  expect(formatDate(new Date('January 1, 1900'))).toBe('1900/01/1')
})
