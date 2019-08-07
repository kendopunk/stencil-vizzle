/**
 * src/components/stv-line-chart/stv-line-chart.e2e.ts
 */
import props from './test-props'
import {
  E2EElement,
  E2EPage,
  newE2EPage
} from '@stencil/core/testing'

const getContentElement = async(element: E2EElement) => {
  return await element.shadowRoot.querySelector('div')
}

describe('<stv-line-chart> e2e test', () => {
  let page: E2EPage
  let element: E2EElement
  let contentElement: any

  beforeEach(async() => {
    page = await newE2EPage()
    await page.setContent('<div><stv-line-chart></stv-line-chart></div>')
    element = await page.find('stv-line-chart')
    contentElement = await element.shadowRoot.querySelector('div')
  })

  it('renders without crashing', () => {
    expect(element).toHaveClass('hydrated')
  })

  it('correctly handles changes to attributes/props', async() => {
    await page.$eval('stv-line-chart', (elm: any, {
      axisLabelFontSize, axisTickFontSize, canvasHeight, canvasWidth,
      chartData, chartId, colorScheme, gridlines, hideXAxis, hideXTicks,
      hideYAxis, hideYTicks, legend, legendFontSize, legendMetric, legendWidth,
      marginBottom, marginLeft, marginRight, marginTop, responsive, strokeWidth,
      tooltips, vertices, xLabel, xMetric, xTickFormat, xTickSize,
      yLabel, yMetric, yTickFormat, yTickSize
    }) => {
      elm.axisLabelFontSize = axisLabelFontSize
      elm.axisTickFontSize = axisTickFontSize
      elm.canvasHeight = canvasHeight
      elm.canvasWidth = canvasWidth
      elm.chartData = chartData
      elm.chartId = chartId
      elm.colorScheme = colorScheme
      elm.gridlines = gridlines
      elm.hideXAxis = hideXAxis
      elm.hideXTicks = hideXTicks
      elm.hideYAxis = hideYAxis
      elm.hideYTicks = hideYTicks
      elm.legend = legend
      elm.legendFontSize = legendFontSize
      elm.legendMetric = legendMetric
      elm.legendWidth = legendWidth
      elm.marginBottom = marginBottom
      elm.marginLeft = marginLeft
      elm.marginRight = marginRight
      elm.marginTop = marginTop
      elm.responsive = responsive
      elm.strokeWidth = strokeWidth
      elm.tooltips = tooltips
      elm.vertices = vertices
      elm.xLabel = xLabel
      elm.xMetric = xMetric
      elm.xTickFormat = xTickFormat
      elm.xTickSize = xTickSize
      elm.yLabel = yLabel
      elm.yMetric = yMetric
      elm.yTickFormat = yTickFormat
      elm.yTickSize = yTickSize
    }, props)

    await page.waitForChanges()

    contentElement = await getContentElement(element)
    // console.log(contentElement.innerHTML)

    ////////////////////////////////////////
    // <svg>
    // 2 <g> elements ... canvas and legend
    ////////////////////////////////////////
    const svgEl = contentElement.querySelector('svg')
    expect(svgEl).toBeDefined()
    expect(svgEl.getAttribute('height')).toBe(props.canvasHeight.toString())
    expect(svgEl.getAttribute('width')).toBe(props.canvasWidth.toString())
    expect(svgEl.childNodes.length).toEqual(2)

    ////////////////////////////////////////
    // <g class="canvas">
    // 13 child nodes: 3 <g>, 2 <path>, 2 <text> for axis labels
    // and 6 vertex circles
    ////////////////////////////////////////
    const canvasEl = contentElement.querySelector('g.canvas')
    expect(canvasEl).toBeDefined()
    expect(canvasEl.childNodes.length).toEqual(13)

    ////////////////////////////////////////
    // <g class="legend">
    // number of child nodes = chartData.length * 2
    ////////////////////////////////////////
    const legendEl = contentElement.querySelector('g.legend')
    expect(legendEl).toBeDefined()
    expect(legendEl.childNodes.length).toBe(props.chartData.length * 2)

    ////////////////////////////////////////
    // <path class="main">
    // number of path elements = chartData.length
    ////////////////////////////////////////
    const pathEl = contentElement.querySelectorAll('path.main')
    expect(pathEl).toBeDefined()
    expect(pathEl.length).toBe(props.chartData.length)

    ////////////////////////////////////////
    // <circle class="vertex">
    // total count = total number of x/y objects
    ////////////////////////////////////////
    const vertexEl = contentElement.querySelectorAll('circle.vertex')
    expect(vertexEl).toBeDefined()
    expect(vertexEl.length).toBe(6)

    ////////////////////////////////////////
    // X + Y axis labels
    ////////////////////////////////////////
    const xLabelEl = contentElement.querySelector('text.x-axis-label')
    expect(xLabelEl).toBeDefined()
    expect(xLabelEl.textContent).toEqual(props.xLabel)

    const yLabelEl = contentElement.querySelector('text.y-axis-label')
    expect(yLabelEl).toBeDefined()
    expect(yLabelEl.textContent).toEqual(props.yLabel)

    ////////////////////////////////////////
    // legend lines + text elements
    ////////////////////////////////////////
    const legendLineEl = contentElement.querySelectorAll('line.legend-line')
    expect(legendLineEl).toBeDefined()
    expect(legendLineEl.length).toBe(props.chartData.length)

    const legendTextEl = contentElement.querySelectorAll('text.legend-text')
    expect(legendTextEl).toBeDefined()
    expect(legendTextEl.length).toBe(props.chartData.length)

    ////////////////////////////////////////
    // gridlines
    ////////////////////////////////////////
    const xGridlineEl = contentElement.querySelectorAll('line.x-gridline')
    expect(xGridlineEl).toBeDefined()

    const yGridlineEl = contentElement.querySelectorAll('line.y-gridline')
    expect(yGridlineEl).toBeDefined()

    ////////////////////////////////////////
    // tooltip <div>
    ////////////////////////////////////////
    const tooltipDiv = contentElement.querySelector('#tooltip')
    expect(tooltipDiv).toBeDefined()
  })
})
