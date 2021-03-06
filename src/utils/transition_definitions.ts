/**
 * src/utils/transition_definitions.ts
 * Defining global transitions
 */
import { transition } from 'd3-transition'

export const t25 = () => {
  return transition().duration(25)
}

export const t50 = () => {
  return transition().duration(50)
}

export const t100 = () => {
  return transition().duration(100)
}

export const t250 = () => {
  return transition().duration(250)
}

export const t500 = () => {
  return transition().duration(500)
}
