/**
 * src/interfaces/IfcStvPieChart.ts
 */
interface StvPieChartItem {
  label?: string,
  value?: number,
  color?: string,
  [propName: string]: any
}

export interface IfcStvPieChart extends Array<StvPieChartItem>{}
