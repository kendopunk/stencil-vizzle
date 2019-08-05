/**
 * src/js/lineChart.js
 * <stv-line-chart> helper functions
 */

/**
 * vars
 */
var hideXAxis = false;
var hideYAxis = false;
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
  return document.querySelector('stv-line-chart');
}

/**
 * Toggle functions
 */
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

function toggleShowHideXLabel() {
  showXLabel = !showXLabel;
  getChartEl().xLabel = showXLabel ? 'Date' : '';
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

function toggleShowHideYLabel() {
  showYLabel = !showYLabel;
  getChartEl().yLabel = showYLabel ? 'Score' : '';
}

function toggleShowHideYTicks() {
  showYTicks = !showYTicks;
  getChartEl().hideYTicks = !showYTicks;
}


/**
 * @function
 * Generate chart data
 * @param numLines
 */
function generateLineChartData(numLines) {
  var dt = new Date('2019-01-01 00:00:00');
  var msd = 86400000;

  var data = [{
    label: 'User 1',
    data: [
      {x: dt.getTime() + (msd * 10), y: 71},
      {x: dt.getTime() + (msd * 20), y: 251},
      {x: dt.getTime() + (msd * 30), y: 357},
      {x: dt.getTime() + (msd * 40), y: 414},
      {x: dt.getTime() + (msd * 50), y: 270},
      {x: dt.getTime() + (msd * 60), y: 33}
    ]
   }, {
    label: 'User 2',
    data: [
      {x: dt.getTime() + (msd * 10), y: 418},
      {x: dt.getTime() + (msd * 20), y: 380},
      {x: dt.getTime() + (msd * 30), y: 393},
      {x: dt.getTime() + (msd * 40), y: 107},
      {x: dt.getTime() + (msd * 50), y: 3},
      {x: dt.getTime() + (msd * 60), y: 333}
    ]
   }, {
    label: 'User 3',
    data: [
      {x: dt.getTime() + (msd * 10), y: 473},
      {x: dt.getTime() + (msd * 20), y: 311},
      {x: dt.getTime() + (msd * 30), y: 405},
      {x: dt.getTime() + (msd * 40), y: 65},
      {x: dt.getTime() + (msd * 50), y: 101},
      {x: dt.getTime() + (msd * 60), y: 18}
    ]
   }, {
    label: 'User 4',
    data: [
      {x: dt.getTime() + (msd * 10), y: 56},
      {x: dt.getTime() + (msd * 20), y: -7},
      {x: dt.getTime() + (msd * 30), y: 68},
      {x: dt.getTime() + (msd * 40), y: -137},
      {x: dt.getTime() + (msd * 50), y: 208},
      {x: dt.getTime() + (msd * 60), y: 470}
    ]
   }];

   return data.slice(0, numLines);
}

/**
 * @function
 * Random number generator
 */
function randomizer() {
  return Math.floor(Math.random() * 500) - 250;
}

/**
 * @function
 * Generate random line chart data, including negative numbers
 */
function generateRandomLineChartData() {
  var dt = new Date('2019-01-01 00:00:00');
  var msd = 86400000;
  var iterations = Math.floor(Math.random() * 6) + 1;
  var data = []

  for (var i = 0; i < iterations; i++) {
    var u = i + 1;
    var user = 'User ' + u;

    data.push({
      label: user,
      data: [
        {x: dt.getTime() + (msd * 10), y: randomizer()},
        {x: dt.getTime() + (msd * 20), y: randomizer()},
        {x: dt.getTime() + (msd * 30), y: randomizer()},
        {x: dt.getTime() + (msd * 40), y: randomizer()},
        {x: dt.getTime() + (msd * 50), y: randomizer()},
        {x: dt.getTime() + (msd * 60), y: randomizer()}
      ]
    });
  }

  return data;
}

function generateRandomData() {
  getChartEl().chartData = generateRandomLineChartData()
}

function selectNumLines(numLines) {
  getChartEl().chartData = generateLineChartData(numLines)
}






