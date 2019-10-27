/**
 * src/interfaces/IfcStvLineChart.ts
 */
interface StvLineChartItem {
  label?: string,
  color?: string,
  data: any[],
  [propName: string]: any
}

export interface IfcStvLineChart extends Array<StvLineChartItem>{}
