/**
 * src/js/legend.js
 */
var showLegend = false;

function toggleLegend(selector) {
  showLegend = !showLegend;
  getChartEl(selector).legend = showLegend;
}
