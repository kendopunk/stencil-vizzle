/**
 * src/components/stv-line-chart/test-props.ts
 */
export default {
  axisLabelFontSize: 14,
  axisTickFontFamily: 'sans',
  axisTickFontSize: 10,
  canvasHeight: 300,
  canvasWidth: 500,
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
  chartId: 'my-stv-line-chart',
  colorScheme: 'category10',
  gridlines: true,
  hideXAxis: false,
  hideXTicks: false,
  hideYAxis: false,
  hideYTicks: false,
  interpolation: 'linear',
  inverse: false,
  legend: true,
  legendFontSize: 12,
  legendMetric: 'label',
  legendWidth: 150,
  marginBottom: 25,
  marginLeft: 25,
  marginRight: 25,
  marginTop: 25,
  responsive: true,
  strokeWidth: 1,
  tooltips: true,
  vertices: true,
  xLabel: 'X Axis Label',
  xMetric: 'x',
  xTickFormat: 'localestring',
  xTickSize: 2,
  yLabel: 'Y Axis Label',
  yMetric: 'y',
  yTickFormat: 'localestring',
  yTickSize: 2
}
