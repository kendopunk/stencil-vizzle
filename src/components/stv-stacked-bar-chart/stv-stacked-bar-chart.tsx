/**
 * src/components/stv-stacked-bar-chart/stv-stacked-bar-chart.tsx
 */
import {
  Component,
  Prop,
  Element,
  Event,
  EventEmitter,
  Listen
} from '@stencil/core'
import isArray from 'lodash/isArray'
import reverse from 'lodash/reverse'
import uniq from 'lodash/uniq'
import { event, max } from 'd3'
import { axisBottom, axisLeft } from 'd3-axis'
import { scaleBand, scaleLinear, scaleOrdinal } from 'd3-scale'
import {
  schemeCategory10,
  schemeAccent,
  schemePaired,
  schemeSet1
  schemeSet2,
  schemeSet3
} from 'd3-scale-chromatic'
import { Selection, select } from 'd3-selection'
import { stack, stackOrderReverse } from 'd3-shape'
import { transition } from 'd3-transition'

import TickFormat from '../../utils/tickformat'

@Compoment({
  tag: 'stv-stacked-bar-chart',
  styleUrl: 'stv-stacked-bar-chart.scss',
  shadow: true
})

export class StvStackedBarChart {

  colorScale: any
  colorSchemes: any = {
    category10: schemeCategory10,
    accent: schemeAccent,
    paired: schemePaired,
    set1: schemeSet1,
    set2: schemeSet2,
    set3: schemeSet3,
    black: ['#000000'],
    gray: ['#888888']
  }
  gCanvas: Selection<Element, any, HTMLElement, any>
  gGrid: Selection<Element, any, HTMLElement, any>
  gLegend: Selection<Element, any, HTMLElement, any>
  gXAxis: Selection<Element, any, HTMLElement, any>
  gYAxis: Selection<Element, any, HTMLElement, any>
  layerOpacity: number = 0.9
  layers: any
  linearScale: any
  ordinalScale: any
  stackLayout: any
  svg: Selection<Element, any, HTMLElement, any>
  tooltipDiv: Selection<Element, any, HTMLElement, any>
  xAxis: Selection<Element, any, HTMLElement, any>
  xLabelPadding: number = 30
  yAxis: Selection<Element, any, HTMLElement, any>
  yLabelPadding: number = 30

  @Element() private chartElement: HTMLElement

  @Prop() axisFontSize: number = 9
  @Prop() barStroke: string = '#333333'
  @Prop() barStrokeWidth: number = 1
  @Prop({
    reflectToAttr: true,
    mutable: true
  }) canvasHeight: number = 300
  @Prop({
    reflectToAttr: true,
    mutable: true
  }) canvasWidth: number = 500
  @Prop() chartData: any = []
  @Prop() colorScheme: string = 'category10'
  @Prop() gridlines: boolean = false
  @Prop() hideXAxis: boolean = false
  @Prop() hideXTickValues: boolean = false
  @Prop() hideYAxis: boolean = false
  @Prop() hideYTickValues: boolean = false
  @Prop({reflectToAttr: true}) id: string = ''
  @Prop() legend: boolean = false
  @Prop() legendWidth: number = 125
  @Prop() linearDomain: string = 'absolute'
  @Prop() linearMetric: string = 'value'
  @Prop() linearTickFormat: string = 'raw'
  @Prop({reflectToAttr: true}) marginBottom: number = 25
  @Prop({reflectToAttr: true}) marginLeft: number = 25
  @Prop({reflectToAttr: true}) marginRight: number = 25
  @Prop({reflectToAttr: true}) marginTop: number = 25
  @Prop() maxBarWidth: number = 75
  @Prop() ordinalMetric: string = 'label'
  @Prop() orientation: string = 'vertical'
  @Prop() responsive: boolean = false
  @Prop() seriesMetric: string = 'label'
  @Prop() tooltips: boolean = false
  @Prop() xLabel: string = ''
  @Prop() xTickSize: number = 2
  @Prop() yLabel: string = ''
  @Prop() yTickSize: number = 2

  @Event({
    eventName: 'webComponentLoaded'
  }) componentLoaded: EventEmitter

  ////////////////////////////////////////
  // LIFECYCLE
  ////////////////////////////////////////
  componentDidLoad(): void {
    this.svg = select(this.chartElement.shadowRoot.querySelector('svg.stacked-bar-chart'))
    this.gCanvas = this.svg.appen('svg:g').attr('class', 'canvas')
    this.gGrid = this.gCanvas.append('svg:g').attr('class', 'grid')
    this.gLegend = this.svg.append('svg:g').attr('class', 'legend')
    this.gXAxis = this.gCanvas.append('svg:g')
      .attr('class', 'axis')
      .style('opacity', 0)
      .style('font-size', `${this.axisFontSize}px`)
    this.gYAxis = this.gCanvas.append('svg:g')
      .attr('class', 'axis')
      .style('opacity', 0)
      .style('font-size', `${this.axisFontSize}px`)

    // color scale
    this.colorScale = scaleOrdinal()

    // tooltip <div>
    this.tooltipDiv = select(this.chartElement.shadowRoot.querySelector('#tooltip'))
      .attr('class', 'tooltip')
      .style('opacity', 0)

    // responsive
    if (this.responsive) {
      this.canvasWidth = this.chartElement.parentElement.getBoundingClientRect().width
      this.canvasHeight = this.chartElement.parentElement.getBoundingClientRect().height
    }

    // initialize axes
    this.xAxis = axisBottom()
    this.yAxis = axisLeft()

    this.componentLoaded.emit({
      component: 'stv-stacked-bar-chart',
      id: this.id
    })
  }

  componentWillUpdate(): void {
    if (this.isValidChartData()) {
      this.draw()
    }
  }

  ////////////////////////////////////////
  // LISTENERS
  ////////////////////////////////////////
  @Listen('resize', {target: 'window'})
  handleWindowResize() {
    if (this.responsive) {
      this.canvasWidth = this.chartElement.parentElement.getBoundingClientRect().width
      this.draw()
    }
  }

  ////////////////////////////////////////
  // CLASS METHODS
  ////////////////////////////////////////

  /**
   * @function
   * Call axis generators for horizontal orientation
   */
  callHorizontalAxes(): void {
    //
    // X = linear
    //
    this.gXAxis.style('font-size', `${this.axisFontSize}px`)
      .attr('transform', () => {
        if (this.chartData.length === 0) {
          return
        }

        const x = this.marginLeft + this.yLabelAdjustment()
        const y = this.canvasHeight - this.marginBottom - this.xLabelAdjustment()

        return `translate(${x}, ${y})`
      })
      .style('opacity', () => {
        return this.hideXAxis || this.chartData.length === 0 ? 0 : 1
      })
      .call(this.xAxis)

    //
    // Y = ordinal
    //
    this.gYAxis.style('font-size', `${this.axisFontSize}px`)
      .attr('transform', () => {
        if (this.chartData.length === 0) {
          return
        }

        const x = this.marginLeft + this.yLabelAdjustment()
        const y = this.linearScale(0)

        return `translate(${x}, ${y})`
      })
      .style('opacity', () => {
        return this.hideYAxis || this.chartData.length === 0 ? 0 : 1
      })
      .call(this.yAxis)
  }

  /**
   * @function
   * Call axis generators for vertical (default) orientation
   */
  callVerticalAxes(): void {
    //
    // X = ordinal
    //
    this.gXAxis.style('font-size', `${this.axisFontSize}px`)
      .attr('transform', () => {
        if (this.chartData.length === 0) {
          return
        }

        const x = this.marginLeft
        const y = this.linearScale(0)

        return `translate(${x}, ${y})`
      })
      .style('opacity', () => {
        return this.hideXAxis || this.chartData.length === 0 ? 0 : 1
      })
      .call(this.xAxis)

    //
    // Y = linear
    //
    this.gYAxis.style('font-size', `${this.axisFontSize}px`)
      .attr('transform', () => {
        if (this.chartData.length === 0) {
          return
        }

        const x = this.marginLeft + this.yLabelAdjustment()
        const y = 0

        return `translate(${x}, ${y})`
      })
      .style('opacity', () => {
        return this.hideYAxis || this.chartData.length === 0 ? 0 : 1
      })
      .call(this.yAxis)
  }

  /**
   * @function
   * Drawing wrapper function
   */
  draw(): void {
    this.setColorScale()
    if (this.orientation === 'horizontal') {
      this.setHorizontalScales()
      this.callHorizontalAxes()
      this.handleHorizontalBars()
    } else {
      this.setVerticalScales()
      this.callVerticalAxes()
      this.handleVerticalBars()
    }
    this.handleGridLines()
    this.handleAxisLabels()
    this.handleLegend()
  }

  /**
   * @function
   * Get unique ordinal keys from chartData
   */
  getOrdinalKeys(): Array<string> {
    return uniq(this.chartData.map((m) => {
      return m[this.ordinalMetric]
    })).sort()
  }

  /**
   * @function
   * Get unique series keys from chartData
   */
  getSeriesKeys(): Array<string> {
    return uniq(this.chartData.map((m) => {
      return m[this.seriesMetric]
    })).sort()
  }

  /**
   * @function
   * Optional X- and Y-axis labels
   */
  handleAxisLabels(): void {
    const t100 = transition().duration(100)

    //
    // X: take into account left and right margins
    // and possible Y-axis label padding
    //
    if (this.isValidXLabel()) {
      this.gCanvas.selectAll('text.x-axis-label').remove()

      this.gCanvas.append('text')
        .attr('class', 'x-axis-label')
        .style('text-anchor', 'middle')
        .attr('transform', () => {
          // depends on orientation
          let x = this.marginLeft + this.yLabelAdjustment()
          if (this.orientation === 'horizontal') {
            x = x + (this.linearScale.range()[1] - this.linearScale.range()[0])/2
          } else {
            x = x + (this.ordinalScale.range()[1] - this.ordinalScale.range()[0])/2
          }

          const y = this.canvasHeight - this.xLabelPadding/2

          return `translate(${x}, ${y})`
        })
    } else {
      this.gCanvas.selectAll('text.x-axis-label')
        .transition(t100)
        .style('opacity', 0)
        .remove()
    }

    //
    // Y: take into account top and bottom margins
    // and possible X-axis label padding
    //
  }

  render() {
    return (
      <div>
        <div id="tooltip"></div>
        <svg version="1.1"
          baseProfile="full"
          width={this.canvasWidth}
          height={this.canvasHeight}
          class="stacked-bar-chart"
          xmlns="http://www.w3.org/2000/svg">
        </svg>
      </div>
    )
  }
}
