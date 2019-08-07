/**
 * src/utils/tickformat.ts
 * General axis tick formatting functions
 */
import isFinite from 'lodash/isFinite'
import toNumber from 'lodash/toNumber'

/**
 * @function
 * Determine if a string is readable/parseable date
 * @param input {string}
 */
const isValidDateString = (input: string) => {
  return !isNaN(new Date(input).getTime())
}

/**
 * @function
 * @param value {any}
 * @param modifier {string}
 */
const TickFormat = (value: any, modifier: string = 'raw') => {
  let val: any = value
  const locale = 'en-US'

  switch (modifier) {
    
    case 'USD': {
      if (isFinite(toNumber(value))) {
        val = toNumber(value).toLocaleString(locale, {
          style: 'currency',
          currency: 'USD'
        })
      }
      break
    }

    case 'localestring': {
      if (isFinite(toNumber(value))) {
        val = toNumber(value).toLocaleString(locale)
      }
      break
    }

    case 'localestring1d': {
      if (isFinite(toNumber(value))) {
        val = toNumber(value).toLocaleString(locale, {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1
        })
      }
      break
    }

    case 'localestring2d': {
      if (isFinite(toNumber(value))) {
        val = toNumber(value).toLocaleString(locale, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })
      }
      break
    }

    case 'percent': {
      if (isFinite(toNumber(value))) {
        val = toNumber(value).toLocaleString(locale) + '%'
      }
      break
    }

    case 'percent1d': {
      if (isFinite(toNumber(value))) {
        val = toNumber(value).toLocaleString(locale, {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1
        }) + '%'
      }
      break
    }

    case 'percent2d': {
      if (isFinite(toNumber(value))) {
        val = toNumber(value).toLocaleString(locale, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }) + '%'
      }
      break
    }

    case 'YYYY': {
      if (isValidDateString(value)) {
        val = new Date(value).toLocaleDateString(locale, {
          year: 'numeric'
        })
      }
      break
    }

    case 'M/D/YYYY': {
      if (isValidDateString(value)) {
        val = new Date(value).toLocaleDateString(locale, {
          month: 'numeric',
          day: 'numeric',
          year: 'numeric'
        })
      }
      break
    }

    case 'M/D/YY': {
      if (isValidDateString(value)) {
        val = new Date(value).toLocaleDateString(locale, {
          month: 'numeric',
          day: 'numeric',
          year: '2-digit'
        })
      }
      break
    }

    case 'MM/DD/YYYY': {
      if (isValidDateString(value)) {
        val = new Date(value).toLocaleDateString(locale, {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric'
        })
      }
      break
    }

    case 'MM YYYY': {
      if (isValidDateString(value)) {
        val = new Date(value).toLocaleDateString(locale, {
          month: 'short',
          year: 'numeric'
        })
      }
      break
    }

    case 'MMM D, YYYY': {
      if (isValidDateString(value)) {
        val = new Date(value).toLocaleDateString(locale, {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })
      }
      break
    }

    case 'ISODATE': {
      if (isValidDateString(value)) {
        val = new Date(value).toISOString()
      }
      break
    }

    // "raw"
    default: {
      break;
    }
  }

  return val
}

export default TickFormat
