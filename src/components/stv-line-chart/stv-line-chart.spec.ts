/**
 * src/components/stv-line-chart/stv-line-chart.spec.ts
 */
import { StvLineChart } from './stv-line-chart'
import props from './test-props'

describe('<stv-line-chart> unit test', () => {

  let lineChart

  beforeEach(() => {
    lineChart = new StvLineChart()
    Object.keys(props).forEach((k) => {
      lineChart[k] = props[k]
    })
  })

  it('verifies the supplied props/attributes', () => {
    Object.keys(props).forEach((k) => {
      expect(lineChart[k]).toEqual(props[k])
    })
  })
})