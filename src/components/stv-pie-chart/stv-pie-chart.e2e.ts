/**
 * src/components/stv-pie-chart/stv-pie-chart.e2e.ts
 */
import props from './test-props'
import {
  E2EElement,
  E2EPage,
  newE2EPage
} from '@stencil/core/testing'
import kebabCase from 'kebab-case'

const getContentElement = async(element: E2EElement) => {
  return await element.shadowRoot.querySelector('div')
}

describe('<stv-pie-chart> e2e test', () => {
  let page: E2EPage
  let element: E2EElement
  let contentElement: any
  const tagName: string = 'stv-pie-chart'

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

  /**
   * generic render test
   */
  it('renders without crashing', () => {
    expect(element).toHaveClass('hydrated')
  })

  /**
   * chartData
   */
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
    // 1 <g> -> gPie
    ////////////////////////////////////////
    const canvasEl = contentElement.querySelector('g.canvas')
    expect(canvasEl).toBeDefined()
    expect(canvasEl.childNodes.length).toBe(1)

    ////////////////////////////////////////
    // <g class="legend">
    ////////////////////////////////////////
    const legendEl = contentElement.querySelector('g.legend')
    expect(legendEl).toBeDefined()
    expect(legendEl.childNodes.length).toBe(props.chartData.length * 2)
    expect(legendEl.querySelectorAll('line').length).toBe(props.chartData.length)
    expect(legendEl.querySelectorAll('text').length).toBe(props.chartData.length)

    ////////////////////////////////////////
    // tooltip <div>
    ////////////////////////////////////////
    expect(contentElement.querySelector('#tooltip')).toBeDefined()
  })

  /**
   * legend FALSE
   */
  it('hides the legend', async() => {
    await page.$eval(tagName, (elm: any, {chartData}) => {
      elm.chartData = chartData
      elm.legend = false
    }, props)
    await page.waitForChanges()
    contentElement = await getContentElement(element)

    expect(contentElement.querySelector('g.legend').childNodes.length).toBe(0)
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

    expect(contentElement.querySelectorAll('text.legend-label-inverse').length).toBe(props.chartData.length)
  })
})