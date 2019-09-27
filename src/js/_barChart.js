/**
 * src/js/_barChart.js
 * <stv-bar-chart> helper
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

function selectNumBars(numBars) {
  getChartEl('stv-bar-chart').chartData = generateBarChartData(numBars)
}
