/**
 * src/utils/css_utils.ts
 * Helper functions for managing styles
 */
export const axisFontFamilyCls = (fontFamily) => {
  let ret = 'axis-sans'

  switch (fontFamily) {
    case 'serif': {
      ret = 'axis-serif'
      break
    }

    case 'monospace': {
      ret = 'axis-monospace'
      break
    }

    default: {
      break;
    }
  }

  return ret;
}
