/**
 * src/components/stv-bar-chart/stv-bar-chart.spec.ts
 */
import { StvBarChart } from './stv-bar-chart'
import props from './test-props'

describe('<stv-bar-chart> unit test', () => {

  let barChart

  beforeEach(() => {
    barChart = new StvBarChart()
    Object.keys(props).forEach((k) => {
      barChart[k] = props[k]
    })
  })

  it('verifies the supplied props/attributes', () => {
    Object.keys(props).forEach((k) => {
      expect(barChart[k]).toEqual(props[k])
    })
  })
})