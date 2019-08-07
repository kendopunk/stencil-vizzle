/**
 * src/js/stackedBarChart.js
 * <stv-stacked-bar-chart> Javascript
 */
var currentTankCategory = 'Light Tank';
var currentXLabel = 'Year';
var currentYLabel = 'Production'
var gridlines = false;
var groupByConfiguration = 'year'
var hideXAxis = false;
var hideYAxis = false;
var linearDomain = 'absolute';
var orientation = 'vertical';
var selectedYears = ['1942', '1943', '1944'];
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
  return document.querySelector('stv-stacked-bar-chart');
}

/**
 * @function
 * generate data for the bar chart
 */
function generateStackedBarChartData() {
  var filteredData;

  if (groupByConfiguration === 'country') {
    filteredData = tankProductionData.filter((f) => {
      return f.armament === currentTankCategory;
    })
  } else {
    filteredData = tankProductionData.filter((f) => {
      return selectedYears.indexOf(f.year) >= 0 && f.armament === currentTankCategory;
    })
  }
  getChartEl().chartData = filteredData;
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

function selectGroupBy() {
  var val = document.querySelector('#groupBy').value || 'year'
  var el = getChartEl()
  if (val === 'country') {
    el.ordinalMetric = 'combatant';
    el.seriesMetric = 'year';
    el.xLabel = 'Country'
  } else {
    el.ordinalMetric = 'year';
    el.seriesMetric = 'combatant';
    el.xLabel = 'Year'
  }
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
    currentXLabel = 'Production';
    currentYLabel = 'Year';
  } else {
    currentXLabel = 'Year';
    currentYLabel = 'Production';
  }

  el.xLabel = currentXLabel;
  el.yLabel = currentYLabel;
}

function selectTankCategory() {
  var val = document.querySelector('#tankCategory').value || 'Light Tank';
  currentTankCategory = val;
  generateStackedBarChartData();
}

/**
 * toggle functions
 */
function toggleGridlines() {
  gridlines = !gridlines;
  getChartEl().gridlines = gridlines;
}

function toggleLegend() {
  showLegend = !showLegend;
  getChartEl().legend = showLegend;
}

function togglePercent() {
  var tf;
  var el = getChartEl();

  if (linearDomain === 'absolute') {
    linearDomain = 'percent';
    tf = 'percent';
  } else {
    linearDomain = 'absolute';
    tf = 'localestring';
  }
  el.linearDomain = linearDomain;
  el.linearTickFormat = tf;
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
 * check/uncheck a particular year
 */
function yearCheck(year) {
  var el = document.querySelector('#year'+ year)
  if (el) {
    if (el.checked) {
      selectedYears.push(year)
    } else {
      selectedYears = selectedYears.filter(function(f) { return f !== year })
    }

    generateStackedBarChartData()
  }
}


/**
 * baseline WW2 tank production data
 * source: https://i1.wp.com/mathscinotes.com/wp-content/uploads/2017/09/ProductionTable.png
 */
var tankProductionData = [
  {year: '1941', combatant: 'Germany', armament: 'Light Tank', produced: 943},
  {year: '1941', combatant: 'Germany', armament: 'Medium Tank', produced: 2680},
  {year: '1941', combatant: 'Germany', armament: 'Heavy Tank', produced: 0},
  {year: '1941', combatant: 'Soviet Union', armament: 'Light Tank', produced: 2321},
  {year: '1941', combatant: 'Soviet Union', armament: 'Medium Tank', produced: 3016},
  {year: '1941', combatant: 'Soviet Union', armament: 'Heavy Tank', produced: 1353},
  {year: '1941', combatant: 'US', armament: 'Light Tank', produced: 2591},
  {year: '1941', combatant: 'US', armament: 'Medium Tank', produced: 1430},
  {year: '1941', combatant: 'US', armament: 'Heavy Tank', produced: 0},
  {year: '1942', combatant: 'Germany', armament: 'Light Tank', produced: 1500},
  {year: '1942', combatant: 'Germany', armament: 'Medium Tank', produced: 3952},
  {year: '1942', combatant: 'Germany', armament: 'Heavy Tank', produced: 78},
  {year: '1942', combatant: 'Soviet Union', armament: 'Light Tank', produced: 9580},
  {year: '1942', combatant: 'Soviet Union', armament: 'Medium Tank', produced: 13473},
  {year: '1942', combatant: 'Soviet Union', armament: 'Heavy Tank', produced: 2635},
  {year: '1942', combatant: 'US', armament: 'Light Tank', produced: 10674},
  {year: '1942', combatant: 'US', armament: 'Medium Tank', produced: 15720},
  {year: '1942', combatant: 'US', armament: 'Heavy Tank', produced: 0},
  {year: '1943', combatant: 'Germany', armament: 'Light Tank', produced: 1811},
  {year: '1943', combatant: 'Germany', armament: 'Medium Tank', produced: 9050},
  {year: '1943', combatant: 'Germany', armament: 'Heavy Tank', produced: 740},
  {year: '1943', combatant: 'Soviet Union', armament: 'Light Tank', produced: 5512},
  {year: '1943', combatant: 'Soviet Union', armament: 'Medium Tank', produced: 19808},
  {year: '1943', combatant: 'Soviet Union', armament: 'Heavy Tank', produced: 1422},
  {year: '1943', combatant: 'US', armament: 'Light Tank', produced: 9024},
  {year: '1943', combatant: 'US', armament: 'Medium Tank', produced: 28164},
  {year: '1943', combatant: 'US', armament: 'Heavy Tank', produced: 0},
  {year: '1944', combatant: 'Germany', armament: 'Light Tank', produced: 2507},
  {year: '1944', combatant: 'Germany', armament: 'Medium Tank', produced: 15380},
  {year: '1944', combatant: 'Germany', armament: 'Heavy Tank', produced: 1069},
  {year: '1944', combatant: 'Soviet Union', armament: 'Light Tank', produced: 7155},
  {year: '1944', combatant: 'Soviet Union', armament: 'Medium Tank', produced: 22618},
  {year: '1944', combatant: 'Soviet Union', armament: 'Heavy Tank', produced: 4764},
  {year: '1944', combatant: 'US', armament: 'Light Tank', produced: 5738},
  {year: '1944', combatant: 'US', armament: 'Medium Tank', produced: 15489},
  {year: '1944', combatant: 'US', armament: 'Heavy Tank', produced: 40},
  {year: '1945', combatant: 'Germany', armament: 'Light Tank', produced: 1335},
  {year: '1945', combatant: 'Germany', armament: 'Medium Tank', produced: 2931},
  {year: '1945', combatant: 'Germany', armament: 'Heavy Tank', produced: 140},
  {year: '1945', combatant: 'Soviet Union', armament: 'Light Tank', produced: 2966},
  {year: '1945', combatant: 'Soviet Union', armament: 'Medium Tank', produced: 16602},
  {year: '1945', combatant: 'Soviet Union', armament: 'Heavy Tank', produced: 3100},
  {year: '1945', combatant: 'US', armament: 'Light Tank', produced: 2801},
  {year: '1945', combatant: 'US', armament: 'Medium Tank', produced: 8055},
  {year: '1945', combatant: 'US', armament: 'Heavy Tank', produced: 2162}
]