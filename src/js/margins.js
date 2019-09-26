/**
 * src/js/margins.js
 * Controlling top, right, bottom, and left margins
 */
function setMargin(marginAttribute, selector) {
  var val = document.querySelector('#' + marginAttribute).value;
  var el = getChartEl(selector)
  el[marginAttribute] = val;
}
