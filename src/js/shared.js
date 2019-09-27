/**
 * src/js/shared.js
 * Common Javascript for all charts
 */

/****************************************
 * vars for all *.index.html
 ****************************************/
var gridlines = false;
var inverse = false;
var showLegend = false;
var vertices = true;

/****************************************
 * shared functions
 ****************************************/
function getChartEl(id) {
  return document.querySelector(id);
}

function randomizer() {
  return Math.floor(Math.random() * 500) - 250;
}

function selectAxisLabelFontSize(selector) {
  var val = document.querySelector('#axisLabelFontSize').value;
  getChartEl(selector).axisLabelFontSize = val;
}

function selectAxisTickFontSize(selector) {
  var val = document.querySelector('#axisTickFontSize').value;
  getChartEl(selector).axisTickFontSize = val;
}

function selectAxisTickFontFamily(selector) {
  var val = document.querySelector('#axisTickFontFamily').value;
  getChartEl(selector).axisTickFontFamily = val;
}

function selectColorScheme(selector) {
  var val = document.querySelector('#colorScheme').value;
  getChartEl(selector).colorScheme = val;
}

function selectInterpolation(selector) {
  var val = document.querySelector('#interpolation').value;
  getChartEl(selector).interpolation = val;
}

function selectMargin(marginAttribute, selector) {
  var val = document.querySelector('#' + marginAttribute).value;
  var el = getChartEl(selector)
  el[marginAttribute] = val;
}

function selectMaxBarWidth(selector) {
  var val = document.querySelector('#maxBarWidth').value;
  getChartEl(selector).maxBarWidth = val;
}

function selectXTickSize(selector) {
  var val = document.querySelector('#xTickSize').value;
  getChartEl(selector).xTickSize = val;
}

function selectYTickSize(selector) {
  var val = document.querySelector('#yTickSize').value;
  getChartEl(selector).yTickSize = val;
}

function toggleGridlines(selector) {
  gridlines = !gridlines;
  getChartEl(selector).gridlines = gridlines;
}

function toggleInverse(selector) {
  inverse = !inverse;
  getChartEl(selector).inverse = inverse;

  if (inverse) {
    document.querySelector('div.chart').classList.add('inverse')
  } else {
    document.querySelector('div.chart').classList.remove('inverse')
  }
}

function toggleLegend(selector) {
  showLegend = !showLegend;
  getChartEl(selector).legend = showLegend;
}

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

function toggleVertices(selector) {
  vertices = !vertices;
  getChartEl(selector).vertices = vertices;
}


