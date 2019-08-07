/**
 * src/interfaces/IfcStvStackedBarChart.ts
 */
interface IfcStvStackedBarChartItem {
  category?: string,
  label?: string,
  value?: number,
  [propName: string]: any
}

export interface IfcStvStackedBarChart extends Array<IfcStvStackedBarChartItem>{}
