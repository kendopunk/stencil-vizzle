/**
 * src/js/stackedBarChart.js
 * <stv-stacked-bar-chart> Javascript
 */
var selectedYears = ['1942', '1943', '1944']
var currentArmament = 'Light Tank'



/**
 * @function
 * generate data for the bar chart
 */
function generateStackedBarChartData() {
  // return tankProductionData.filter((f) => {

  // })
  console.log('foo')
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