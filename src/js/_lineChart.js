/**
 * src/js/lineChart.js
 * <stv-line-chart> helper functions
 */
function generateLineChartData(numLines) {

  var dt = new Date(1546318800000);
  var msd = 86400000;

  var data = [{
    label: 'User 1',
    name: 'Mark',
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
    name: 'Fred',
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
    name: 'Diane',
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
    name: 'Jackie',
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

function generateRandomLineChartData() {
  var dt = new Date(1546318800000);
  var msd = 86400000;
  var iterations = Math.floor(Math.random() * 6) + 1;
  var data = []

  for (var i = 0; i < iterations; i++) {
    var u = i + 1;
    var user = 'User ' + u;

    data.push({
      label: user,
      name: user.toUpperCase(),
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
  getChartEl('stv-line-chart').chartData = generateRandomLineChartData()
}

function selectNumLines(numLines) {
  getChartEl('stv-line-chart').chartData = generateLineChartData(numLines)
}
