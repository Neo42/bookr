import {formatDate} from '../misc'

test('将日期正确格式化', () => {
  expect(formatDate(new Date('January 1, 1900'))).toBe('1900/01/1')
})
