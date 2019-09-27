/**
 * src/utils/css_utils.ts
 * Helper functions for managing styles
 */
export const calculateAxisClass = (inverse, axisTickFontFamily) => {
  const cls = ['axis']

  if (inverse) {
    cls.push('axis-inverse')
  } else {
    cls.push('axis-direct')
  }

  if (axisTickFontFamily === 'monospace') {
    cls.push('axis-monospace')
  } else if (axisTickFontFamily === 'serif') {
    cls.push('axis-serif')
  } else {
    cls.push('axis-sans')
  }

  return cls.join(' ')
}

export const calculateAxisLabelClass = (inverse, axis) => {
  const cls = []
  if (axis === 'y') {
    cls.push('y-axis-label')
  } else {
    cls.push('x-axis-label')
  }

  if (inverse) {
    cls.push('axis-label-inverse')
  } else {
    cls.push('axis-label-direct')
  }

  return cls.join(' ')
}

export const calculateLegendLabelClass = (inverse) => {
  const cls = ['legend-label']
  if (inverse) {
    cls.push('legend-label-inverse')
  } else {
    cls.push('legend-label-direct')
  }

  return cls.join(' ')
}
