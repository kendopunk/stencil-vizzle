/**
 * src/utils/tests/tickformat.spec.ts
 */
import TickFormat from '../tickformat'

describe('TickFormat() for numerics', () => {

  const num = 1234.56789
  const stringnum = num.toString()

  // "raw"
  it('verifies the "raw" formatting code', () => {
    expect(TickFormat(num, 'raw')).toEqual(num)
    expect(TickFormat(num)).toEqual(num)  // raw = default
    expect(TickFormat(stringnum, 'raw')).toEqual(stringnum)
    expect(TickFormat('hello', 'raw')).toEqual('hello')
    expect(TickFormat(Infinity, 'raw')).toEqual(Infinity)
    expect(TickFormat(null, 'raw')).toBeNull()
  })

  // localestring
  it('verifies the "localestring" formatting code', () => {
    expect(TickFormat(num, 'localestring')).toEqual('1,234.568')
    expect(TickFormat(stringnum, 'localestring')).toEqual('1,234.568')
    expect(TickFormat('hello', 'localestring')).toEqual('hello')
    expect(TickFormat(Infinity, 'localestring')).toEqual(Infinity)
    expect(TickFormat(null, 'localestring')).toEqual('0')
  })

  // localestring1d
  it('verifies the "localestring1d" formatting code', () => {
    expect(TickFormat(num, 'localestring1d')).toEqual('1,234.6')
    expect(TickFormat(stringnum, 'localestring1d')).toEqual('1,234.6')
    expect(TickFormat('hello', 'localestring1d')).toEqual('hello')
    expect(TickFormat(Infinity, 'localestring1d')).toEqual(Infinity)
    expect(TickFormat(null, 'localestring1d')).toEqual('0.0')
  })

  // localestring2d
  it('verifies the "localestring2d" formatting code', () => {
    expect(TickFormat(num, 'localestring2d')).toEqual('1,234.57')
    expect(TickFormat(stringnum, 'localestring2d')).toEqual('1,234.57')
    expect(TickFormat('hello', 'localestring2d')).toEqual('hello')
    expect(TickFormat(Infinity, 'localestring2d')).toEqual(Infinity)
    expect(TickFormat(null, 'localestring2d')).toEqual('0.00')
  })

  // percent
  it('verifies the "percent" formatting code', () => {
    expect(TickFormat(num, 'percent')).toEqual('1,234.568%')
    expect(TickFormat(stringnum, 'percent')).toEqual('1,234.568%')
    expect(TickFormat('hello', 'percent')).toEqual('hello')
    expect(TickFormat(Infinity, 'percent')).toEqual(Infinity)
    expect(TickFormat(null, 'percent')).toEqual('0%')
  })

  // percent1d
  it('verifies the "percent1d" formatting code', () => {
    expect(TickFormat(num, 'percent1d')).toEqual('1,234.6%')
    expect(TickFormat(stringnum, 'percent1d')).toEqual('1,234.6%')
    expect(TickFormat('hello', 'percent1d')).toEqual('hello')
    expect(TickFormat(Infinity, 'percent1d')).toEqual(Infinity)
    expect(TickFormat(null, 'percent1d')).toEqual('0.0%')
  })

  // percent2d
  it('verifies the "percent2d" formatting code', () => {
    expect(TickFormat(num, 'percent2d')).toEqual('1,234.57%')
    expect(TickFormat(stringnum, 'percent2d')).toEqual('1,234.57%')
    expect(TickFormat('hello', 'percent2d')).toEqual('hello')
    expect(TickFormat(Infinity, 'percent2d')).toEqual(Infinity)
    expect(TickFormat(null, 'percent2d')).toEqual('0.00%')
  })

  // USD
  it('verifies the "USD" formatting code', () => {
    expect(TickFormat(num, 'USD')).toEqual('$1,234.57')
    expect(TickFormat(stringnum, 'USD')).toEqual('$1,234.57')
    expect(TickFormat('hello', 'USD')).toEqual('hello')
    expect(TickFormat(Infinity, 'USD')).toEqual(Infinity)
    expect(TickFormat(null, 'USD')).toEqual('$0.00')
  })
})

describe('TickFormat() for dates', () => {
  const d1 = new Date('1986-12-22 15:45:23 UTC')
  const d2 = new Date('2019-01-05 11:30:30 UTC')

  it('verifies the "YYYY" formatter', () => {
    const fmt = 'YYYY'
    expect(TickFormat(d1, fmt)).toEqual('1986')
    expect(TickFormat(d2, fmt)).toEqual('2019')
    expect(TickFormat(Infinity, fmt)).toEqual(Infinity)
    expect(TickFormat(null, fmt)).toEqual('1969')
    expect(TickFormat('hello', fmt)).toEqual('hello')
  })

  it('verifies the "M/D/YYYY" formatter', () => {
    const fmt = 'M/D/YYYY'
    expect(TickFormat(d1, fmt)).toEqual('12/22/1986')
    expect(TickFormat(d2, fmt)).toEqual('1/5/2019')
    expect(TickFormat(Infinity, fmt)).toEqual(Infinity)
    expect(TickFormat(null, fmt)).toEqual('12/31/1969')
    expect(TickFormat('hello', fmt)).toEqual('hello')
  })

  it('verifies the "M/D/YY" formatter', () => {
    const fmt = 'M/D/YY'
    expect(TickFormat(d1, fmt)).toEqual('12/22/86')
    expect(TickFormat(d2, fmt)).toEqual('1/5/19')
    expect(TickFormat(Infinity, fmt)).toEqual(Infinity)
    expect(TickFormat(null, fmt)).toEqual('12/31/69')
    expect(TickFormat('hello', fmt)).toEqual('hello')
  })

  it('verifies the "MM/DD/YYYY" formatter', () => {
    const fmt = 'MM/DD/YYYY'
    expect(TickFormat(d1, fmt)).toEqual('12/22/1986')
    expect(TickFormat(d2, fmt)).toEqual('01/05/2019')
    expect(TickFormat(Infinity, fmt)).toEqual(Infinity)
    expect(TickFormat(null, fmt)).toEqual('12/31/1969')
    expect(TickFormat('hello', fmt)).toEqual('hello')
  })

  it('verifies the "MM YYYY" formatter', () => {
    const fmt = 'MM YYYY'
    expect(TickFormat(d1, fmt)).toEqual('Dec 1986')
    expect(TickFormat(d2, fmt)).toEqual('Jan 2019')
    expect(TickFormat(Infinity, fmt)).toEqual(Infinity)
    expect(TickFormat(null, fmt)).toEqual('Dec 1969')
    expect(TickFormat('hello', fmt)).toEqual('hello')
  })

  it('verifies the "MMM D, YYYY" formatter', () => {
    const fmt = 'MMM D, YYYY'
    expect(TickFormat(d1, fmt)).toEqual('Dec 22, 1986')
    expect(TickFormat(d2, fmt)).toEqual('Jan 5, 2019')
    expect(TickFormat(Infinity, fmt)).toEqual(Infinity)
    expect(TickFormat(null, fmt)).toEqual('Dec 31, 1969')
    expect(TickFormat('hello', fmt)).toEqual('hello')
  })

  it('verifies the "ISODATE" formatter', () => {
    const fmt = 'ISODATE'
    expect(TickFormat(d1, fmt)).toEqual('1986-12-22T15:45:23.000Z')
    expect(TickFormat(d2, fmt)).toEqual('2019-01-05T11:30:30.000Z')
    expect(TickFormat(Infinity, fmt)).toEqual(Infinity)
    expect(TickFormat(null, fmt)).toEqual('1970-01-01T00:00:00.000Z')
    expect(TickFormat('hello', fmt)).toEqual('hello')
  })
})
