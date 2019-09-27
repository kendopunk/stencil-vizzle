/**
 * src/js/shared.js
 * Common Javascript for all charts
 */

/**
 * utilities
 */
function randomizer() {
  return Math.floor(Math.random() * 500) - 250;
}

function getChartEl(id) {
  return document.querySelector(id);
}
