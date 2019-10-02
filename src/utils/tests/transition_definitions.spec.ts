/**
 * src/utils/tests/transition_definitions.spec.ts
 * Unit tests for d3 transition definitions
 */
import { t25, t50, t100, t250, t500 } from '../transition_definitions'

describe('Testing transition definitions', () => {
  it('verifies the definitions', () => {
    expect(t25()).toBeDefined()
    expect(t50()).toBeDefined()
    expect(t100()).toBeDefined()
    expect(t250()).toBeDefined()
    expect(t500()).toBeDefined()
  })
})