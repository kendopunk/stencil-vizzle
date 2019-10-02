/**
 * src/utils/tests/interpolation.spec.ts
 * Unit tests for line interpolation functions
 */
import {
  curveBasis,
  curveLinear,
  curveMonotoneX,
  curveStep,
  curveStepBefore,
  curveStepAfter
} from 'd3-shape'
import { getInterpolation } from '../interpolation'

describe('Testing line interpolation utilities', () => {
  it('verifies getInterpolation()', () => {
    expect(getInterpolation('basis')).toEqual(curveBasis)
    expect(getInterpolation('monotone')).toEqual(curveMonotoneX)
    expect(getInterpolation('step')).toEqual(curveStep)
    expect(getInterpolation('step-before')).toEqual(curveStepBefore)
    expect(getInterpolation('step-after')).toEqual(curveStepAfter)
    expect(getInterpolation('linear')).toEqual(curveLinear)
    expect(getInterpolation('foo')).toEqual(curveLinear)
  })
})
