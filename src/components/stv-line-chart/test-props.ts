/**
 * src/components/stv-line-chart/test-props.ts
 */
export default {
  axisLabelFontSize: 12,
  axisTickFontSize: 10,
  canvasHeight: 400,
  canvasWidth: 600,
  chartData: [{
    label: 'User 1',
    color: '#000000',
    data: [
      {x: 0, y: 100},
      {x: 10, y: 50},
      {x: 20, y: 75}
    ]
  }, {
    label: 'User 2',
    color: '#990066',
    data: [
      {x: 0, y: 25},
      {x: 50, y: 50},
      {x: 100, y: 200}
    ]
  }],
  chartId: 'myStvLineChart',
  colorScheme: 'category10',
  gridlines: true,
  hideXAxis: false,
  hideXTicks: false,
  hideYAxis: false,
  hideYTicks: false,
  legend: true,
  legendFontSize: 12,
  legendMetric: 'label',
  legendWidth: 125,
  marginBottom: 25,
  marginLeft: 25,
  marginRight: 25,
  marginTop: 25,
  responsive: false,
  strokeWidth: 1,
  tooltips: true,
  vertices: true,
  xLabel: 'Day Number',
  xMetric: 'x',
  xTickFormat: 'raw',
  xTickSize: 2,
  yLabel: 'Score',
  yMetric: 'y',
  yTickFormat: 'localestring',
  yTickSize: 2
}
