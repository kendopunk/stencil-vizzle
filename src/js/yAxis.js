/**
 * src/js/yAxis.js
 * Controlling Y-axis attributes
 */
var hideYAxis = false;
var showYLabel = true;
var showYTicks = true;

function toggleShowHideYAxis(selector) {
  hideYAxis = !hideYAxis;
  var el = getChartEl(selector);

  if (hideYAxis) {
    el.yLabel = ''
    el.hideYAxis = true;
    el.hideYTicks = true;

    showYLabel = false;
    showYTicks = false;

    document.querySelector('#yLabel').checked = false;
    document.querySelector('#yLabel').disabled = true;
    document.querySelector('#yTicks').checked = false;
    document.querySelector('#yTicks').disabled = true;
  } else {
    el.yLabel = 'Score'
    el.hideYAxis = false;
    el.hideYTicks = false;

    showYLabel = true;
    showYTicks = true;

    document.querySelector('#yLabel').checked = true;
    document.querySelector('#yLabel').disabled = false;
    document.querySelector('#yTicks').checked = true;
    document.querySelector('#yTicks').disabled = false;
  }
}

function toggleShowHideYLabel(selector) {
  showYLabel = !showYLabel;
  getChartEl(selector).yLabel = showYLabel ? 'Score' : '';
}

function toggleShowHideYTicks(selector) {
  showYTicks = !showYTicks;
  getChartEl(selector).hideYTicks = !showYTicks;
}