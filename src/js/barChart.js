/**
 * src/js/lineChart.js
 * <stv-line-chart> helper functions
 */

/**
 * vars
 */
var currentXLabel = 'Stock Ticker';
var currentYLabel = 'Price';
var gridlines = false;
var hideXAxis = false;
var hideYAxis = false;
var orientation = 'vertical'
var showLegend = false;
var showXLabel = true;
var showXTicks = true;
var showYLabel = true;
var showYTicks = true;

/**
 * @function
 * Get reference to the chart component
 */
function getChartEl() {
  return document.querySelector('stv-bar-chart');
}

/**
 * Select functions
 */
function selectAxisLabelFontSize() {
  var val = document.querySelector('#axisLabelFontSize').value || 12;
  getChartEl().axisLabelFontSize = val;
}

function selectAxisTickFontSize() {
  var val = document.querySelector('#axisTickFontSize').value || 10;
  getChartEl().axisTickFontSize = val;
}

function selectAxisTickSize() {
  var val = document.querySelector('#axisTickSize').value || 2;
  var el = getChartEl();
  el.xTickSize = val;
  el.yTickSize = val;
}

function selectColorScheme() {
  var val = document.querySelector('#colorScheme').value;
  getChartEl().colorScheme = val || 'category10';
}

function selectMargins() {
  var val = document.querySelector('#margins').value;
  var el = getChartEl();
  el.marginTop = el.marginBottom = el.marginLeft = el.marginRight = val;
}

function selectMaxBarWidth() {
  var val = document.querySelector('#maxBarWidth').value || 75;
  getChartEl().maxBarWidth = val;
}

function selectOrientation() {
  var val = document.querySelector('#orientation').value || 'vertical'
  orientation = val;

  var el = getChartEl();
  el.orientation = val
  if (orientation === 'horizontal') {
    currentXLabel = 'Price';
    currentYLabel = 'Stock Ticker';
  } else {
    currentXLabel = 'Stock Ticker';
    currentYLabel = 'Price';
  }

  el.xLabel = currentXLabel;
  el.yLabel = currentYLabel;
}

/**
 * Toggle functions
 */
function toggleGridlines() {
  gridlines = !gridlines;
  getChartEl().gridlines = gridlines;
}

function toggleLegend() {
  showLegend = !showLegend;
  getChartEl().legend = showLegend;
}

function toggleShowHideXAxis() {
  hideXAxis = !hideXAxis;
  var el = getChartEl();

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
    el.xLabel = currentXLabel;
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

function toggleShowHideXLabel() {
  showXLabel = !showXLabel;
  getChartEl().xLabel = showXLabel ? currentXLabel : '';
}

function toggleShowHideXTicks() {
  showXTicks = !showXTicks;
  getChartEl().hideXTicks = !showXTicks;
}

function toggleShowHideYAxis() {
  hideYAxis = !hideYAxis;
  var el = getChartEl();

  if (hideYAxis) {
    el.xLabel = ''
    el.hideYAxis = true;
    el.hideYTicks = true;

    showYLabel = false;
    showYTicks = false;

    document.querySelector('#yLabel').checked = false;
    document.querySelector('#yLabel').disabled = true;
    document.querySelector('#yTicks').checked = false;
    document.querySelector('#yTicks').disabled = true;
  } else {
    el.yLabel = currentYLabel;
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

function toggleShowHideYLabel() {
  showYLabel = !showYLabel;
  getChartEl().yLabel = showYLabel ? currentYLabel : '';
}

function toggleShowHideYTicks() {
  showYTicks = !showYTicks;
  getChartEl().hideYTicks = !showYTicks;
}

/**
 * @function
 * Generate chart data
 * @param numBars
 */
function generateBarChartData(numBars) {
  var data = [
    {ticker: 'KO', name: 'Coca-Cola', value: 52.36},
    {ticker: 'BZH', name: 'Beazer Homes', value: 11.11},
    {ticker: 'ADM', name: 'Arch-Dan-Mid', value: 37.17},
    {ticker: 'ABCB', name: 'Ameris Bancorp', value: 36.44},
    {ticker: 'ORCL', name: 'Oracle', value: 53.75},
    {ticker: 'PLNT', name: 'Planet Fitness', value: 77.27}
  ]

  data.sort(function(a, b) {
    return a.ticker > b.ticker ? 1 : -1;
  })

  return data.slice(0, numBars);
}

/**
 * @function
 * Random number generator
 */
function randomizer() {
  return Math.floor(Math.random() * 500) - 250;
}



function selectNumBars(numBars) {
  getChartEl().chartData = generateBarChartData(numBars)
}
