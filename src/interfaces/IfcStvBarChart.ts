/**
 * src/interfaces/IfcStvBarChart.ts
 */
interface StvBarChartDataItem {
  label?: string,
  color?: string,
  [propName: string]: any
}

export interface IfcStvBarChart extends Array<StvBarChartDataItem>{}
