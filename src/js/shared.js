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
function changeXLabel(selector, value) {
  getChartEl(selector).xLabel = value;
  document.querySelector('#xLabelInput').value = '';
}

function changeYLabel(selector, value) {
  getChartEl(selector).yLabel = value;
  document.querySelector('#yLabelInput').value = '';
}

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

function selectBarStroke(selector) {
  var val = document.querySelector('#barStroke').value;
  getChartEl(selector).barStroke = val;
}

function selectBarStrokeWidth(selector) {
  var val = document.querySelector('#barStrokeWidth').value;
  getChartEl(selector).barStrokeWidth = val;
}

function selectColorScheme(selector) {
  var val = document.querySelector('#colorScheme').value;
  getChartEl(selector).colorScheme = val;
}

function selectInterpolation(selector) {
  var val = document.querySelector('#interpolation').value;
  getChartEl(selector).interpolation = val;
}

function selectLegendFontSize(selector) {
  var val = document.querySelector('#legendFontSize').value
  getChartEl(selector).legendFontSize = val;
}

function selectLinearDomain(selector) {
  var val = document.querySelector('#linearDomain').value
  var el = getChartEl(selector)
  if (val === 'percent') {
    el.linearTickFormat = 'percent1d'
  } else {
    el.linearTickFormat = 'localestring'
  }
  getChartEl(selector).linearDomain = val;
}

function selectLineStroke(selector) {
  var val = document.querySelector('#lineStroke').value
  getChartEl(selector).strokeWidth = val;
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
  var val = document.querySelector('#orientation').value || 'vertical';
  var el = getChartEl(selector);
  var xLabel, yLabel;

  // horizontal orientation
  if (val === 'horizontal') {
    if (selector === 'stv-stacked-bar-chart') {
      xLabel = 'Production';
      yLabel = 'Year'
    } else {
      xLabel = 'Price'
      yLabel = 'Ticker Symbol'
    }
  } else {
    if (selector === 'stv-stacked-bar-chart') {
      xLabel = 'Year';
      yLabel = 'Production'
    } else {
      xLabel = 'Ticker Symbol'
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


