/**
 * src/js/inverse.js
 * inverting the colors
 */
var inverse = false;

function toggleInverse(selector) {
  inverse = !inverse;
  getChartEl(selector).inverse = inverse;

  if (inverse) {
    document.querySelector('div.chart').classList.add('inverse')
  } else {
    document.querySelector('div.chart').classList.remove('inverse')
  }
}
