/**
 * src/js/vertices.js
 * Handling path connection point vertex elements
 */
var vertices = true;

function toggleVertices(selector) {
  vertices = !vertices;
  getChartEl(selector).vertices = vertices;
}
