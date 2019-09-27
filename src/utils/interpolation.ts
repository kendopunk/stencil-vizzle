/**
 * src/utils/interpolation.ts
 * line interpolation...curve()
 */
import {
  curveBasis,
  curveLinear,
  curveMonotoneX,
  curveStep,
  curveStepBefore,
  curveStepAfter
} from 'd3-shape'

export const getInterpolation = (interpolation) => {
  if (interpolation === 'basis') {
    return curveBasis
  } else if (interpolation === 'monotone') {
    return curveMonotoneX
  } else if (interpolation === 'step') {
    return curveStep
  } else if (interpolation === 'step-before') {
    return curveStepBefore
  } else if (interpolation === 'step-after') {
    return curveStepAfter
  } else {
    return curveLinear
  }
}
