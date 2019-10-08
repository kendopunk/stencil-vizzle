/**
 * src/js/lineChart.js
 * <stv-line-chart> helper functions
 * https://www.businessinsider.com/best-selling-music-artists-of-all-time-2016-9
 */
var musicSalesData = [
  {artist: 'The Beatles', units: 183},
  {artist: 'Garth Brooks', units: 148},
  {artist: 'Elvis Presley', units: 146.5},
  {artist: 'The Eagles', units: 120 },
  {artist: 'Led Zeppelin', units: 111.5},
  {artist: 'Billy Joel', units: 84.5},
  {artist: 'Michael Jackson', units: 84},
  {artist: 'Elton John', units: 78.5},
  {artist: 'Pink Floyd', units: 75},
  {artist: 'AC/DC', units: 72},
  {artist: 'George Strait', units: 69},
  {artist: 'Barbara Streisand', units: 68.5},
  {artist: 'The Rolling Stones', units: 66.5},
  {artist: 'Aerosmith', units: 66.5},
  {artist: 'Bruce Springsteen', units: 65.5}
]

function generatePieChartData(numWedges) {
  return musicSalesData.slice(0, numWedges)
}

function selectTopN(num) {
  getChartEl('stv-pie-chart').chartData = generatePieChartData(num)
}
