/**
 * src/utils/tests/css_utils.spec.ts
 * Unit tests for CSS utilities
 */
import {
  calculateAxisClass,
  calculateAxisLabelClass,
  calculateLegendLabelClass
} from '../css_utils'

describe('Testing CSS utilities', () => {
  it('verifies calculateAxisClass()', () => {
    expect(calculateAxisClass(false, 'monospace')).toBe('axis axis-direct axis-monospace')
    expect(calculateAxisClass(false, 'serif')).toBe('axis axis-direct axis-serif')
    expect(calculateAxisClass(false, 'sans')).toBe('axis axis-direct axis-sans')
    expect(calculateAxisClass(false, 'foo')).toBe('axis axis-direct axis-sans')
    expect(calculateAxisClass(true, 'monospace')).toBe('axis axis-inverse axis-monospace')
    expect(calculateAxisClass(true, 'serif')).toBe('axis axis-inverse axis-serif')
    expect(calculateAxisClass(true, 'sans')).toBe('axis axis-inverse axis-sans')
    expect(calculateAxisClass(true, 'foo')).toBe('axis axis-inverse axis-sans')
  })

  it('verifies calculateAxisLabelClass()', () => {
    expect(calculateAxisLabelClass(false, 'x')).toBe('x-axis-label axis-label-direct')
    expect(calculateAxisLabelClass(false, 'y')).toBe('y-axis-label axis-label-direct')
    expect(calculateAxisLabelClass(true, 'x')).toBe('x-axis-label axis-label-inverse')
    expect(calculateAxisLabelClass(true, 'y')).toBe('y-axis-label axis-label-inverse')
  })

  it('verifies calculateLegendLabelClass()', () => {
    expect(calculateLegendLabelClass(false)).toBe('legend-label legend-label-direct')
    expect(calculateLegendLabelClass(true)).toBe('legend-label legend-label-inverse')
  })
})
