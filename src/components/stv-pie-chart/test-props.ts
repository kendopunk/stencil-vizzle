/**
 * src/components/stv-pie-chart/test-props.ts
 */
export default {
  canvasHeight: 450,
  canvasWidth: 450,
  chartData: [
    {label: 'A', value: 100},
    {label: 'B', value: 200},
    {label: 'C', value: 150},
    {label: 'D', value: 75}
  ],
  chartId: 'myStvPieChart',
  colorScheme: 'category10',
  innerRadius: 0,
  inverse: false,
  legend: true,
  legendFontSize: 12,
  legendMetric: 'label',
  legendWidth: 125,
  marginBottom: 10,
  marginLeft: 10,
  marginRight: 10,
  marginTop: 10,
  responsive: false,
  stroke: 'transparent',
  strokeWidth: 1,
  tooltips: true,
  valueFormat: 'localestring',
  valueMetric: 'value'
}
