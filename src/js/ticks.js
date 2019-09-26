/**
 * src/js/ticks.js
 * Handling tick font size / tick length changes
 */
function selectAxisTickFontSize(selector) {
  var val = document.querySelector('#axisTickFontSize').value;
  getChartEl(selector).axisTickFontSize = val;
}

function selectXTickSize(selector) {
  var val = document.querySelector('#xTickSize').value;
  getChartEl(selector).xTickSize = val;
}

function selectYTickSize(selector) {
  var val = document.querySelector('#yTickSize').value;
  getChartEl(selector).yTickSize = val;
}
