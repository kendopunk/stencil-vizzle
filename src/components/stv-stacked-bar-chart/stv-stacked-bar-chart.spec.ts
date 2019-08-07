/**
 * src/components/stv-stacked-bar-chart/stv-stacked-bar-chart.spec.ts
 */
import { StvStackedBarChart } from './stv-stacked-bar-chart'
import props from './test-props'

describe('<stv-stacked-bar-chart> unit test', () => {

  let stackedBarChart

  beforeEach(() => {
    stackedBarChart = new StvStackedBarChart()
    Object.keys(props).forEach((k) => {
      stackedBarChart[k] = props[k]
    })
  })

  it('verifies the supplied props/attributes', () => {
    Object.keys(props).forEach((k) => {
      expect(stackedBarChart[k]).toEqual(props[k])
    })
  })
})