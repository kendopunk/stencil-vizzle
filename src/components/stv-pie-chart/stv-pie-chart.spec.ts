/**
 * src/components/stv-pie-chart/stv-pie-chart.spec.ts
 */
import { StvPieChart } from './stv-pie-chart'
import props from './test-props'

describe('<stv-pie-chart> unit test', () => {

  let pieChart

  beforeEach(() => {
    pieChart = new StvPieChart()
    Object.keys(props).forEach((k) => {
      pieChart[k] = props[k]
    })
  })

  it('verifies the supplied props/attributes', () => {
    Object.keys(props).forEach((k) => {
      expect(pieChart[k]).toEqual(props[k])
    })
  })
})