/**
 * src/js/orientation.js
 * Toggling bar chart orientation
 */
function toggleOrientation(selector) {
  console.log(selector)
  var val = document.querySelector('#orientation').value || 'vertical';
  var el = getChartEl(selector);
  var xLabel, yLabel;

  // horizontal orientation
  if (val === 'horizontal') {
    if (selector === 'stv-stacked-bar-chart') {
      xlabel = 'Production';
      yLabel = 'Year'
    } else {
      xLabel = 'Price'
      yLabel = 'Stock Ticker'
    }
  } else {
    if (selector === 'stv-stacked-bar-chart') {
      xlabel = 'Year';
      yLabel = 'Production'
    } else {
      xLabel = 'Stock Ticker'
      yLabel = 'Price'
    }
  }

  el.orientation = val;
  el.xLabel = xLabel;
  el.yLabel = yLabel;
}
