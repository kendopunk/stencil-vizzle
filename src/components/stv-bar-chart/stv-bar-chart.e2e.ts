/**
 * src/components/stv-bar-chart/stv-bar-chart.e2e.ts
 */
import {
  E2EElement,
  E2EPage,
  newE2EPage
} from '@stencil/core/testing'
import kebabCase from 'kebab-case'

import props from './test-props'

const getContentElement = async(element: E2EElement) => {
  return await element.shadowRoot.querySelector('div')
}

describe('<stv-bar-chart> e2e test', () => {
  let page: E2EPage
  let element: E2EElement
  let contentElement: any
  const tagName: string = 'stv-bar-chart'

  beforeEach(async() => {
    let content = `<div><${tagName} `
    for (const [key, value] of Object.entries(props)) {
      if(value !== false) {
        if (value === true) {
          content = content + `${kebabCase(key)} `
        } else {
          if(key !== 'chartData') {
            content = content + `${kebabCase(key)}="${value}" `
          }
        }
      }
    }
    content = content + `></${tagName}></div>`

    page = await newE2EPage()
    await page.setContent(content)
    element = await page.find(tagName)
    contentElement = await element.shadowRoot.querySelector('div')
  })

  it('renders without crashing', () => {
    expect(element).toHaveClass('hydrated')
  })

  it('correctly handles a new "chartData" attribute', async() => {
    await page.$eval(tagName, (elm: any, {chartData}) => {
      elm.chartData = chartData
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
    expect(svgEl.childNodes.length).toBe(2)

    ////////////////////////////////////////
    // <g class="canvas">
    // 4 <g> - x-axis, y-axis, legend, and grid
    // 5 <rect>
    // 2 <text> for axis labels
    // = 11 child nodes
    ////////////////////////////////////////
    const canvasEl = contentElement.querySelector('g.canvas')
    expect(canvasEl).toBeDefined()
    expect(canvasEl.childNodes.length).toBe(11)

    ////////////////////////////////////////
    // <g class="legend">
    // number of child nodes = chartData.length * 2
    ////////////////////////////////////////
    const legendEl = contentElement.querySelector('g.legend')
    expect(legendEl).toBeDefined()
    expect(legendEl.childNodes.length).toBe(props.chartData.length * 2)
    expect(legendEl.querySelectorAll('line').length).toBe(props.chartData.length)
    expect(legendEl.querySelectorAll('text').length).toBe(props.chartData.length)

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

    const legendTextEl = contentElement.querySelectorAll('text.legend-label')
    expect(legendTextEl).toBeDefined()
    expect(legendTextEl.length).toBe(props.chartData.length)

    ////////////////////////////////////////
    // gridlines
    ////////////////////////////////////////
    expect(contentElement.querySelectorAll('line.gridline').length).toBeGreaterThan(0)

    ////////////////////////////////////////
    // tooltip <div>
    ////////////////////////////////////////
    expect(contentElement.querySelector('#tooltip')).toBeDefined()
  })

  /**
   * gridlines FALSE
   */
  it('turns gridlines off', async() => {
    await page.$eval(tagName, (elm: any, {chartData}) => {
      elm.chartData = chartData
      elm.gridlines = false
    }, props)
    await page.waitForChanges()
    contentElement = await getContentElement(element)

    expect(contentElement.querySelectorAll('line.gridline').length).toBe(0)
  })

  /**
   * Hide X and Y axis ticks
   * This removes all g.tick group elements
   */
  it('hides the X and Y axis ticks', async () => {
    await page.$eval(tagName, (elm: any, {chartData}) => {
      elm.chartData = chartData
      elm.hideXTicks = true
      elm.hideYTicks = true
    }, props)
    await page.waitForChanges()
    contentElement = await getContentElement(element)

    expect(contentElement.querySelectorAll('g.tick').length).toBe(0)
  })

  /**
   * legend FALSE
   */
  it('hides the legend', async() => {
    await page.$eval(tagName, (elm: any, {chartData}) => {
      elm.chartData = chartData
      elm.hideXAxis = false
      elm.hideYAxis = false
      elm.legend = false
    }, props)
    await page.waitForChanges()
    contentElement = await getContentElement(element)

    expect(contentElement.querySelector('g.legend').childNodes.length).toBe(0)
  })

  /**
   * hide X and Y axis labels, set to ""
   */
  it('hides the X and Y axis labels', async() => {
    await page.$eval(tagName, (elm: any, {chartData}) => {
      elm.chartData = chartData
      elm.xLabel = ''
      elm.yLabel = ''
    }, props)
    await page.waitForChanges()
    contentElement = await getContentElement(element)

    expect(contentElement.querySelectorAll('text.x-axis-label').length).toBe(0)
    expect(contentElement.querySelectorAll('text.y-axis-label').length).toBe(0)
  })

  /**
   * repopulate X and Y axis labels
   */
  it('repopulates the X and Y axis labels', async() => {
    await page.$eval(tagName, (elm: any, {chartData}) => {
      elm.chartData = chartData
      elm.xLabel = 'Foo'
      elm.yLabel = 'Bar'
    }, props)
    await page.waitForChanges()
    contentElement = await getContentElement(element)

    expect(contentElement.querySelector('text.x-axis-label').textContent).toBe('Foo')
    expect(contentElement.querySelector('text.y-axis-label').textContent).toBe('Bar')
  })

  /**
   * changing tick format size
   */
  it('handles tick size changes', async() => {
    await page.$eval(tagName, (elm: any, {chartData}) => {
      elm.chartData = chartData
      elm.xTickSize = 4
      elm.yTickSize = 6
    }, props)
    await page.waitForChanges()
    contentElement = await getContentElement(element)

    contentElement.querySelectorAll('g.tick').forEach((gtick) => {
      const line = gtick.querySelector('line')
      if (line.hasAttribute('y2')) {
        expect(line.getAttribute('y2')).toBe('4')
      }
      if (line.hasAttribute('x2')) {
        expect(line.getAttribute('x2')).toBe('-6')  // y-axis
      }
    })
  })

  /**
   * going inverse
   */
  it('handles the "inverse" prop', async() => {
    await page.$eval(tagName, (elm: any, {chartData}) => {
      elm.chartData = chartData
      elm.inverse = true
    }, props)
    await page.waitForChanges()
    contentElement = await getContentElement(element)

    expect(contentElement.querySelectorAll('g.axis-inverse').length).toBe(2)
    expect(contentElement.querySelectorAll('text.legend-label-inverse').length).toBe(props.chartData.length)
    expect(contentElement.querySelectorAll('text.axis-label-inverse').length).toBe(2)
  })
})
