/**
 * src/components/stv-stacked-bar-chart/stv-stacked-bar-chart.e2e.ts
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

describe('<stv-stacked-bar-chart> e2e test', () => {
  let page: E2EPage
  let element: E2EElement
  let contentElement: any

  beforeEach(async() => {
    page = await newE2EPage()
    await page.setContent('<div><stv-stacked-bar-chart></stv-stacked-bar-chart></div>')
    element = await page.find('stv-stacked-bar-chart')
    contentElement = await element.shadowRoot.querySelector('div')
  })

  it('renders without crashing', () => {
    expect(element).toHaveClass('hydrated')
  })
})