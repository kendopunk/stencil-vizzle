/**
 * src/js/xAxis.js
 * controlling X-axis attributes
 */
var hideXAxis = false;
var showXLabel = true;
var showXTicks = true;

function toggleShowHideXAxis(selector) {
  hideXAxis = !hideXAxis;
  var el = getChartEl(selector);

  if (hideXAxis) {
    el.xLabel = ''
    el.hideXAxis = true;
    el.hideXTicks = true;

    showXLabel = false;
    showXTicks = false;

    document.querySelector('#xLabel').checked = false;
    document.querySelector('#xLabel').disabled = true;
    document.querySelector('#xTicks').checked = false;
    document.querySelector('#xTicks').disabled = true;
  } else {
    el.xLabel = 'Date'
    el.hideXAxis = false;
    el.hideXTicks = false;

    showXLabel = true;
    showXTicks = true;

    document.querySelector('#xLabel').checked = true;
    document.querySelector('#xLabel').disabled = false;
    document.querySelector('#xTicks').checked = true;
    document.querySelector('#xTicks').disabled = false;
  }
}

function toggleShowHideXLabel(selector) {
  showXLabel = !showXLabel;
  getChartEl(selector).xLabel = showXLabel ? 'Date' : '';
}

function toggleShowHideXTicks(selector) {
  showXTicks = !showXTicks;
  getChartEl(selector).hideXTicks = !showXTicks;
}