/**
 * src/components/stv-bar-chart/stv-bar-chart.tsx
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
import { event } from 'd3'
import { axisBottom, axisLeft } from 'd3-axis'
import { scaleBand, scaleLinear, scaleOrdinal } from 'd3-scale'
import {
  schemeCategory10,
  schemeAccent,
  schemePaired,
  schemeSet1,
  schemeSet2,
  schemeSet3
} from 'd3-scale-chromatic'
import { Selection, select } from 'd3-selection'

// interface
import { IfcStvBarChart } from '../../interfaces/IfcStvBarChart'

// utilities
import {
  t50,
  t100,
  t250,
  t500
} from '../../utils/transition_definitions'
import TickFormat from '../../utils/tickformat'

@Component({
  tag: 'stv-bar-chart',
  styleUrl: 'stv-bar-chart.scss',
  shadow: true
})

export class StvBarChart {
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

  // <g> elements
  gCanvas: Selection<Element, any, HTMLElement, any>
  gGrid: Selection<Element, any, HTMLElement, any>
  gLegend: Selection<Element, any, HTMLElement, any>
  gXAxis: Selection<Element, any, HTMLElement, any>
  gYAxis: Selection<Element, any, HTMLElement, any>
  // end </g>

  linearMax: number
  linearScale: any
  maxTooltipWidth: number = 125
  ordinalPadding: number = 0.1
  ordinalScale: any
  svg: Selection<Element, any, HTMLElement, any>
  tooltipDiv: Selection<Element, any, HTMLElement, any>
  xAxis: any
  xLabelPadding: number = 30
  yAxis: any
  yLabelPadding: number = 30

  @Element() private chartElement: HTMLElement

  @Prop() axisLabelFontSize: number = 12
  @Prop() axisTickFontSize: number = 10
  @Prop() barStroke: string = '#333'
  @Prop() barStrokeWidth: number = 1
  @Prop({
    reflectToAttr: true,
    mutable: true
  }) canvasHeight: number = 300
  @Prop({
    reflectToAttr: true,
    mutable: true
  }) canvasWidth: number = 500
  @Prop() chartId: string = ''
  @Prop() chartData: IfcStvBarChart[] = []
  @Prop() colorScheme: string = 'category10'
  @Prop() gridlines: boolean = false
  @Prop() hideXAxis: boolean = false
  @Prop() hideXTicks: boolean = false
  @Prop() hideYAxis: boolean = false
  @Prop() hideYTicks: boolean = false
  @Prop() legend: boolean = false
  @Prop() legendWidth: number = 125
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
  @Prop() tooltips: boolean = false
  @Prop() xLabel: string = ''
  @Prop() xTickSize: number = 2
  @Prop() yLabel: string = ''
  @Prop() yTickSize: number = 2

  @Event({
    eventName: 'stv-bar-chart-loaded',
    bubbles: true,
    composed: true
  }) componentLoaded: EventEmitter

  ////////////////////////////////////////
  // LIFECYCLE
  ////////////////////////////////////////
  componentDidLoad(): void {
    this.svg = select(this.chartElement.shadowRoot.querySelector('svg.stv-bar-chart'))
    this.gCanvas = this.svg.append('svg:g')
      .attr('class', 'canvas')
    this.gGrid = this.gCanvas.append('svg:g')
      .attr('class', 'grid')
    this.gLegend = this.svg.append('svg:g')
      .attr('class', 'legend')
    this.gXAxis = this.gCanvas.append('svg:g')
      .attr('class', 'axis')
      .style('opacity', 0)
      .style('font-size', `${this.axisTickFontSize}px`)
    this.gYAxis = this.gCanvas.append('svg:g')
      .attr('class', 'axis')
      .style('opacity', 0)
      .style('font-size', `${this.axisTickFontSize}px`)

    // tooltip <div>
    this.tooltipDiv = select(this.chartElement.shadowRoot.querySelector('#tooltip'))
      .attr('class', 'tooltip')
      .style('opacity', 0)

    // responsive
    if (this.responsive) {
      this.canvasWidth = this.chartElement.parentElement.getBoundingClientRect().width
      this.canvasHeight = this.chartElement.parentElement.getBoundingClientRect().height
    }

    // basic X/Y axis positions which will not change
    this.xAxis = axisBottom()
    this.yAxis = axisLeft()

    // color scale
    this.colorScale = scaleOrdinal()

    // emit component loaded event
    this.componentLoaded.emit({
      component: 'stv-bar-chart',
      chartId: this.chartId
    })
  }

  componentDidUpdate(): void {
    if (this.isValidChartData()) {
      this.draw()
    }
  }

  ////////////////////////////////////////
  // LISTENERS
  ////////////////////////////////////////
  @Listen('resize', {target: 'window'})
  handleWindowResize() {
    if (this.responsive && this.isValidChartData()) {
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

    // X is linear
    this.gXAxis.style('font-size', `${this.axisTickFontSize}px`)
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

    // Y is ordinal
    this.gYAxis.style('font-size', `${this.axisTickFontSize}px`)
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
   * Call the axis generators for vertical orientation
   */
  callVerticalAxes(): void {

    // X is ordinal
    this.gXAxis.style('font-size', `${this.axisTickFontSize}px`)
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

    // Y is linear
    this.gYAxis.style('font-size', `${this.axisTickFontSize}px`)
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
   * Wrapper function for drawing
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
   * Render X/Y axis labels, if available
   */
  handleAxisLabels(): void {

    // X
    if (this.isValidXLabel()) {
      this.gCanvas.selectAll('text.x-axis-label').remove()

      this.gCanvas.append('text')
        .attr('class', 'x-axis-label')
        .style('font-size', `${this.axisLabelFontSize}px`)
        .style('text-anchor', 'middle')
        .text(this.xLabel)
        .attr('transform', () => {

          // x position depends on orientation
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

    // Y
    if (this.isValidYLabel()) {
      this.gCanvas.selectAll('text.y-axis-label').remove()

      this.gCanvas.append('text')
        .attr('class', 'y-axis-label')
        .style('font-size', `${this.axisLabelFontSize}px`)
        .style('text-anchor', 'middle')
        .text(this.yLabel)
        .attr('transform', () => {
          const x = this.xLabelPadding/2
          const y = this.marginTop
            + (this.canvasHeight - this.marginBottom - this.marginTop - this.xLabelAdjustment())/2

          return `translate(${x}, ${y})`
        })
    } else {
      this.gCanvas.selectAll('text.y-axis-label')
        .transition(t100)
        .style('opacity', 0)
        .remove()
    }
  }

  /**
   * @function
   * Render grid lines, depending on orientation
   * Scales must be set before this method will work properly and it should
   * be called before drawing bars due to z-index
   */
  handleGridlines(): void {
    if (!this.gridlines) {
      this.gGrid.selectAll('line.gridline')
        .transition(t500)
        .style('opacity', 0)
        .remove()

      return
    }

    const gridSelection = this.gGrid.selectAll('line.gridline')
      .data(this.linearScale.ticks())

    gridSelection.exit().remove()

    const sel = gridSelection.enter()
      .append('svg:line')
      .attr('class', 'gridline')
      .style('stroke', '#bbb')
      .style('stroke-width', 0.5)
      .style('stroke-dasharray', ("7","3"))

    if (this.orientation === 'horizontal') {
      sel.merge(gridSelection)
        .attr('x1', (d) => {
          return this.marginLeft
            + this.yLabelAdjustment()
            + this.linearScale(d)
        })
        .attr('x2', (d) => {
          this.this.marginLeft
            + this.yLabelAdjustment()
            + this.linearScale(d)
        })
        .attr('y1', this.marginTop)
        .transition(t100)
        .attr('y2', () => {
          return this.canvasHeight
            - this.marginBottom
            - this.xLabelAdjustment()
        })
    } else {
      sel.merge(gridSelection)
        .attr('x1', () => {
          return this.marginLeft
            + this.yLabelAdjustment()
        })
        .attr('y1', (d) => {
          return this.linearScale(d)
        })
        .attr('y2', (d) => {
          return this.linearScale(d)
        })
        .transition(t100)
        .attr('x2', () => {
          return this.canvasWidth
            - this.marginRight
            - this.legendAdjustment()
        })
    }
  }

  /**
   * @function
   * Draw bars...horizontal orientation
   */
  handleHorizontalBars(): void {

    const barSel = this.gCanvas.selectAll('rect.bar')
      .data(this.chartData)

    barSel.exit().remove()

    barSel.enter()
      .append('rect')
      .style('opacity', 0)
      .attr('rx', 3)
      .attr('ry', 3)
      .attr('class', 'bar')
      .on('mouseover', (d, i, a) => {
        select(a[i]).style('opacity', 1)

        this.tooltipDiv
          .style('left', `${event.pageX}px`)
          .style('top', `${event.pageY + 15}px`)
          .style('opacity', () => {
            return this.tooltips ? 0.9 : 0
          })
          .html(() => {
            return '<b>'
              + d[this.ordinalMetric]
              + '</b><br>'
              + TickFormat(d[this.linearMetric], this.linearTickFormat)
          })
      })
      .on('mouseout', (_d, i, a) => {
        select(a[i]).style('opacity', 0.75)

        this.tooltipDiv.style('opacity', 0).html('')
      })
      .on('mousemove', () => {
        this.tooltipDiv
          .style('left', `${event.pageX}px`)
          .style('top', `${event.pageY + 15}px`)
      })
      .merge(barSel)
      .style('stroke', this.barStroke)
      .style('stroke-width', this.barStrokeWidth)
      .transition(t250)
      .attr('x', () => {
        return this.marginLeft
          + this.yLabelAdjustment()
      })
      .attr('y', (d) => {
        return this.ordinalScale(d[this.ordinalMetric])
          + this.ordinalScale.bandwidth()/2
          - Math.min(this.maxBarWidth, this.ordinalScale.bandwidth())/2
      })
      .attr('width', (d) => {
        return this.linearScale(d[this.linearMetric])
      })
      .attr('height', () => {
        return Math.min(this.maxBarWidth, this.ordinalScale.bandwidth())
      })
      .style('fill', (d, i) => {
        return d.color || this.colorScale(i)
      })
      .transition(t25)
      .style('opacity', 0.75)
  }

  /**
   * @function
   * Optional legend
   */
  handleLegend(): void {
    const lineIncrement = 25

    // adjust position of gLegend
    this.gLegend.attr('transform', () => {
      const x = this.canvasWidth
        - this.legendWidth
      const y = this.marginTop
      return `translate(${x}, ${y})`
    })

    // legend is in play
    if (this.legend) {
      // legend lines

    } else {
      this.gLegend.selectAll('line.legend-line')
        .transition(t100)
        .style('opacity', 0)
        .remove()

      this.gLegend.selectAll('text.legend-text')
        .transition(t100)
        .style('opacity', 0)
        .remove()
    }
  }

}















