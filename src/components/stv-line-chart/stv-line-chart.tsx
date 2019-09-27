/**
 * src/components/stv-line-chart/stv-line-chart.tsx
 * Line Chart component class
 */
import {
  Component,
  h,
  Prop,
  Element,
  Event,
  EventEmitter,
  Listen
} from '@stencil/core'
import isArray from 'lodash/isArray'
import { event, max, min } from 'd3'
import { axisBottom, axisLeft } from 'd3-axis'
import { scaleLinear, scaleOrdinal } from 'd3-scale'
import {
  schemeCategory10,
  schemeAccent,
  schemePaired,
  schemeSet1,
  schemeSet2,
  schemeSet3
} from 'd3-scale-chromatic'
import { Selection, select } from 'd3-selection'
import { line } from 'd3-shape'

// interface
import { IfcStvLineChart } from '../../interfaces/IfcStvLineChart'

// utilities
import {
  calculateAxisClass,
  calculateAxisLabelClass,
  calculateLegendLabelClass,
  foo
} from '../../utils/css_utils'
import { getInterpolation } from '../../utils/interpolation'
import {
  t25,
  t50,
  t100,
  t250,
  t500
} from '../../utils/transition_definitions'
import TickFormat from '../../utils/tickformat'

@Component({
  tag: 'stv-line-chart',
  styleUrl: 'stv-line-chart.scss',
  shadow: true
})

export class StvLineChart {
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
  defaultLineOpacity: number = 0.7

  // <g> elements
  gCanvas: Selection<Element, any, HTMLElement, any>
  gGrid: Selection<Element, any, HTMLElement, any>
  gLegend: Selection<Element, any, HTMLElement, any>
  gXAxis: Selection<Element, any, HTMLElement, any>
  gYAxis: Selection<Element, any, HTMLElement, any>
  // end </g>

  maxTooltipWidth: number = 125
  svg: Selection<Element, any, HTMLElement, any>
  tooltipDiv: Selection<Element, any, HTMLElement, any>
  xAxis: any
  xLabelPadding: number = 30
  xMax: number
  xMin: number
  xScale: any
  yAxis: any
  yLabelPadding: number = 30
  yMax: number
  yMin: number
  yScale: any

  @Element() private chartElement: HTMLElement

  @Prop() axisLabelFontSize: number = 14
  @Prop() axisTickFontFamily: string = 'sans'
  @Prop() axisTickFontSize: number = 10
  @Prop({
    reflectToAttr: true,
    mutable: true
  }) canvasHeight: number = 300
  @Prop({
    reflectToAttr: true,
    mutable: true
  }) canvasWidth: number = 500
  @Prop() chartData: IfcStvLineChart[] = []
  @Prop() chartId: string = ''
  @Prop() colorScheme: string = 'category10'
  @Prop() gridlines: boolean = false
  @Prop() hideXAxis: boolean = false
  @Prop() hideXTicks: boolean = false
  @Prop() hideYAxis: boolean = false
  @Prop() hideYTicks: boolean = false
  @Prop() interpolation: string = 'linear'
  @Prop() inverse: boolean = false
  @Prop() legend: boolean = false
  @Prop() legendFontSize: number = 12
  @Prop() legendMetric: string = 'label'
  @Prop() legendWidth: number = 125
  @Prop({reflectToAttr: true}) marginBottom: number = 25
  @Prop({reflectToAttr: true}) marginLeft: number = 25
  @Prop({reflectToAttr: true}) marginRight: number = 25
  @Prop({reflectToAttr: true}) marginTop: number = 25
  @Prop() responsive: boolean = false
  @Prop() strokeWidth: number = 1
  @Prop() tooltips: boolean = true
  @Prop() vertices: boolean = false
  @Prop() xLabel: string = ''
  @Prop() xMetric: string = 'x'
  @Prop() xTickFormat: string = 'raw'
  @Prop() xTickSize: number = 2
  @Prop() yLabel: string = ''
  @Prop() yMetric: string = 'y'
  @Prop() yTickFormat: string = 'raw'
  @Prop() yTickSize: number = 2

  @Event({
    eventName: 'stv-line-chart-loaded',
    bubbles: true,
    composed: true
  }) componentLoaded: EventEmitter

  ////////////////////////////////////////
  // LIFECYCLE
  ////////////////////////////////////////
  componentDidLoad(): void {
    this.svg = select(this.chartElement.shadowRoot.querySelector('svg.stv-line-chart'))

    this.gCanvas = this.svg.append('svg:g')
      .attr('class', 'canvas')

    this.gGrid = this.gCanvas.append('svg:g')
      .attr('class', 'grid')

    this.gLegend = this.svg.append('svg:g')
      .attr('class', 'legend')

    this.gXAxis = this.gCanvas.append('svg:g')
      .attr('class', calculateAxisClass(this.inverse, this.axisTickFontFamily))
      .style('opacity', 0)
      .style('font-size', `${this.axisTickFontSize}px`)

    this.gYAxis = this.gCanvas.append('svg:g')
      .attr('class', calculateAxisClass(this.inverse, this.axisTickFontFamily))
      .style('opacity', 0)
      .style('font-size', `${this.axisTickFontSize}px`)

    this.tooltipDiv = select(this.chartElement.shadowRoot.querySelector('#tooltip'))
      .attr('class', 'tooltip')
      .style('opacity', 0)

    // responsive configuration
    if (this.responsive) {
      this.canvasHeight = this.chartElement.parentElement.getBoundingClientRect().height
      this.canvasWidth = this.chartElement.parentElement.getBoundingClientRect().width
    }

    // color scale, if color not bound in data
    this.colorScale = scaleOrdinal()

    // emit component loaded event
    this.componentLoaded.emit({
      component: 'stv-line-chart',
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
   * Call the X/Y axis generator functions
   */
  callAxes(): void {
    this.gXAxis
      .style('font-size', `${this.axisTickFontSize}px`)
      .attr('class', calculateAxisClass(this.inverse, this.axisTickFontFamily))
      .attr('transform', () => {
        if (this.xZeroDomain()) {
          return 'translate(0, 0)'
        }
        const y = this.yMin >= 0 ? this.yScale(this.yMin) : this.yScale(0)
        return `translate(0, ${y})`
      })
      .style('opacity', () => {
        return this.hideXAxis || this.xZeroDomain() ? 0 : 1
      })
      .call(this.xAxis)

    this.gYAxis
      .style('font-size', `${this.axisTickFontSize}px`)
      .attr('class', calculateAxisClass(this.inverse, this.axisTickFontFamily))
      .attr('transform', () => {
        if (this.yZeroDomain()) {
          return 'translate(0, 0)'
        }
        return `translate(${this.marginLeft + this.yLabelAdjustment()}, 0)`
      })
      .style('opacity', () => {
        return this.hideYAxis || this.yZeroDomain() ? 0 : 1
      })
      .call(this.yAxis)
  }

  /**
   * @function
   * Drawing wrapper function
   */
  draw(): void {
    this.setScales()
    this.callAxes()
    this.setColorScale()
    this.handleGridlines()
    this.handlePaths()
    this.handleAxisLabels()
    this.handleVertices()
    this.handleLegend()
  }

  /**
   * @function
   * X/Y axis labels (if configured)
   */
  handleAxisLabels(): void {
    //////////////////////////////
    // X
    //////////////////////////////
    if (this.isValidXLabel()) {
      this.gCanvas.selectAll('text.x-axis-label').remove()

      this.gCanvas.append('text')
        .attr('class', calculateAxisLabelClass(this.inverse, 'x'))
        .style('text-anchor', 'middle')
        .text(this.xLabel)
        .style('font-size', `${this.axisLabelFontSize}`)
        .attr('transform', () => {
          const x = this.marginLeft +
            this.yLabelAdjustment() +
            (this.xScale.range()[1] - this.xScale.range()[0])/2

          const y = this.canvasHeight - this.xLabelPadding/2

          return `translate(${x}, ${y})`
        })
    } else {
      this.gCanvas.selectAll('text.x-axis-label')
        .transition(t100)
        .style('opacity', 0)
        .remove()
    }
    
    //////////////////////////////
    // Y
    //////////////////////////////
    if (this.isValidYLabel()) {
      this.gCanvas.selectAll('text.y-axis-label').remove()

      this.gCanvas.append('text')
        .attr('class', calculateAxisLabelClass(this.inverse, 'y'))
        .style('text-anchor', 'middle')
        .style('font-size', `${this.axisLabelFontSize}`)
        .text(this.yLabel)
        .attr('transform', () => {
          const x = this.xLabelPadding/2

          const y = this.marginTop +
            (this.canvasHeight - this.marginBottom - this.marginTop - this.xLabelAdjustment())/2

          return `translate(${x}, ${y}), rotate(-90)`
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
   * Show/hide X + Y gridlines
   */
  handleGridlines(): void {
    if (!this.gridlines) {
      this.gGrid.selectAll('line')
        .transition(t500)
        .style('opacity', 0)
        .remove()

      return
    }

    // X gridlines (north/south)
    const xGridSelection = this.gGrid.selectAll('line.x-gridline')
      .data(this.xScale.ticks())

    xGridSelection.exit().remove()

    const xSel = xGridSelection.enter()
      .append('svg:line')
      .attr('class', 'x-gridline')
      .style('stroke', '#bbb')
      .style('stroke-width', 0.5)
      .style('stroke-dasharray', ("7,3"))

    xSel.merge(xGridSelection)
      .attr('x1', (d) => {
        return this.xScale(d)
      })
      .attr('x2', (d) => {
        return this.xScale(d)
      })
      .attr('y1', this.marginTop)
      .transition(t100)
      .attr('y2', () => {
        return this.canvasHeight
          - this.marginBottom
          - this.xLabelAdjustment()
      })

    // Y gridlines (east/west)
    const yGridSelection = this.gGrid.selectAll('line.y-gridline')
      .data(this.yScale.ticks())

    yGridSelection.exit().remove()

    const ySel = yGridSelection.enter()
      .append('svg:line')
      .attr('class', 'y-gridline')
      .style('stroke', '#bbb')
      .style('stroke-width', 0.5)
      .style('stroke-dasharray', ("7,3"))

    ySel.merge(yGridSelection)
      .attr('x1', () => {
        return this.marginLeft + this.yLabelAdjustment()
      })
      .attr('x2', () => {
        return this.xScale.range()[1]
      })
      .attr('y1', (d) => {
        return this.yScale(d)
      })
      .attr('y2', (d) => {
        return this.yScale(d)
      })
  }

  /**
   * @function
   * Show/hide the legend
   */
  handleLegend(): void {
    const lineIncrement = 25

    // transform "gLegend" grouping
    this.gLegend.attr('transform', () => {
      const x = this.canvasWidth - this.legendWidth
      const y = this.marginTop

      return `translate(${x}, ${y})`
    })

    if (this.legend) {
      //////////////////////////////
      // legend lines
      //////////////////////////////
      const lineSel = this.gLegend.selectAll('line.legend-line')
        .data(this.chartData)

      lineSel.exit().remove()

      lineSel.enter()
        .append('line')
        .attr('class', 'legend-line')
        .attr('x', 0)
        .attr('x2', 10)
        .style('opacity', 0)
        .style('stroke-width', 3)
        .merge(lineSel)
        .transition(t50)
        .attr('y1', (_d, i) => {
          return i * lineIncrement
        })
        .attr('y2', (_d, i) => {
          return i * lineIncrement
        })
        .style('stroke', (d, i) => {
          return d.color || this.colorScale(i)
        })
        .transition(t25)
        .style('opacity', this.defaultLineOpacity)

      //////////////////////////////
      // legend text
      //////////////////////////////
      const textSel = this.gLegend.selectAll('text.legend-label')
        .data(this.chartData)

      textSel.exit().remove()

      textSel.enter()
        .append('text')
        .style('opacity', 0)
        .style('font-size', `${this.legendFontSize}px`)
        .on('mouseover', (_d, i) => {
          // highlight matches
          this.gCanvas.selectAll('path.main')
            .filter((_e, j) => {
              return i === j
            })
            .style('opacity', 1)
            .style('stroke-width', this.strokeWidth + 2)

          // deemphasize non-matches
          this.gCanvas.selectAll('path.main')
            .filter((_e, j) => {
              return i !== j
            })
            .style('opacity', 0.25)
        })
        .on('mouseout', (_d, i) => {
          this.gCanvas.selectAll('path.main')
            .filter((_e, j) => {
              return i === j
            })
            .style('opacity', this.defaultLineOpacity)
            .style('stroke-width', this.strokeWidth)

          this.gCanvas.selectAll('path.main')
            .filter((_e, j) => {
              return i !== j
            })
            .style('opacity', this.defaultLineOpacity)
        })
        .merge(textSel)
        .attr('class', calculateLegendLabelClass(this.inverse))
        .text((d) => {
          return d[this.legendMetric] || ''
        })
        
        .attr('x', 15)
        .attr('y', (_d, i) => {
          return i * lineIncrement + 4
        })
        .transition(t50)
        .style('opacity')
    } else {
      this.gLegend.selectAll('line.legend-line')
        //.style('opacity', 0)
        .remove()

      this.gLegend.selectAll('text')
        //.style('opacity', 0)
        .remove()
    }
  }

  /**
   * @function
   * Draw the line series
   */
  handlePaths(): void {
    const lineFn = line()
      .x((d) => {
        return this.xScale(d[this.xMetric])
      })
      .y((d) => {
        return this.yScale(d[this.yMetric])
      })
      .curve(getInterpolation(this.interpolation))


    const pathSelection = this.gCanvas.selectAll('path.main')
      .data(this.chartData)

    pathSelection.exit().remove()

    pathSelection.enter()
      .append('path')
      .attr('class', 'main')
      .style('fill', 'none')
      .style('opacity', this.defaultLineOpacity)
      .merge(pathSelection)
      .style('stroke', (d, i) => {
        return d.color || this.colorScale(i)
      })
      .style('stroke-width', this.strokeWidth)
      .transition(t250)
      .attr('d', (d) => {
        return lineFn(d.data)
      })
  }

  /**
   * @function
   * Show/hide vertex connection points (svg circle)
   */
 handleVertices(): void {
    if (!this.vertices) {
      this.gCanvas.selectAll('circle')
        .transition(t100)
        .style('opacity', 0)
        .remove()

      return
    }

    // normalize the data for circle generation
    // need a circle at each X/Y
    const normalized = this.chartData.map((m, i) => {
      return m.data.map((item) => {
        if (m.color) {
          return Object.assign(item, {color: m.color})
        } else {
          return Object.assign(item, {color: this.colorScale(i)})
        }
      })
    }).flat()

    const circleSelection = this.gCanvas.selectAll('circle.vertex')
      .style('opacity', 0)
      .data(normalized)

    circleSelection.exit().remove()

    circleSelection.enter()
      .append('circle')
      .attr('r', 4)
      .style('opacity', 0)
      .attr('class', 'vertex')
      .style('stroke', '#fff')
      .style('stroke-width', 1)
      .on('mouseover', (d) => {
        this.tooltipDiv.style('left', () => {
          let x = event.pageX

          // not enough room on the right side for full tooltip
          if (this.xScale.range()[1] - this.xScale(d[this.xMetric]) < this.maxTooltipWidth) {
            x = x - this.maxTooltipWidth
          }

          return `${x}px`
        })
        .style('top', () => {
          return `${event.pageY - 15}px`
        })
        .style('opacity', () => {
          return this.tooltips ? 0.9 : 0
        })
        .html(() => {
          return '<div class="key">'
            + TickFormat(d[this.xMetric], this.xTickFormat)
            + '</div><div class="value">'
            + TickFormat(d[this.yMetric], this.yTickFormat)
            + '</div>'
        })
      })
      .on('mouseout', () => {
        this.tooltipDiv.style('opacity', 0)
          .html('')
      })
      .merge(circleSelection)
      .transition(t100)
      .style('fill', (d, i) => {
        return d.color || this.colorScale(i)
      })
      .attr('cx', (d) => {
        return this.xScale(d[this.xMetric])
      })
      .attr('cy', (d) => {
        return this.yScale(d[this.yMetric])
      })
      .transition(t250)
      .style('opacity', 1)
  }

  /**
   * @function
   * @return bool
   */
  isValidChartData(): boolean {
    return isArray(this.chartData)
      && this.chartData.length > 0
      && this.chartData[0].data[0].hasOwnProperty(this.xMetric)
      && this.chartData[0].data[0].hasOwnProperty(this.yMetric)
  }

  isValidXLabel(): boolean {
    return this.xLabel && this.xLabel.length > 0 && !this.hideXAxis
  }

  isValidYLabel(): boolean {
    return this.yLabel && this.yLabel.length > 0 && !this.hideYAxis
  }

  /**
   * @function
   * Setting color scale options
   */
  setColorScale(): void {
    if (this.colorSchemes[this.colorScheme]) {
      this.colorScale.range(this.colorSchemes[this.colorScheme])
    } else {
      this.colorScale.range(schemeCategory10)
    }
  }

  /**
   * @function
   * Calculate X/Y scales
   */
  setScales(): void {

    const xMetricValues = this.chartData.map((m) => {
      return m.data.map((m2) => {
        return m2[this.xMetric]
      })
    }).flat()

    const yMetricValues = this.chartData.map((m) => {
      return m.data.map((m2) => {
        return m2[this.yMetric]
      })
    }).flat()

    //////////////////////////////
    // min/max X and Y values
    //////////////////////////////
    this.xMin = min(xMetricValues, (d) => { return d })
    this.xMax = max(xMetricValues, (d) => { return d })
    this.yMin = min(yMetricValues, (d) => { return d })
    this.yMax = max(yMetricValues, (d) => { return d })

    //////////////////////////////
    // X scale
    //////////////////////////////
    let rightMarginOrLegend = this.legend ? this.legendWidth + 25 : this.marginRight

    this.xScale = scaleLinear()
      .domain([this.xMin, this.xMax])
      .range([
        this.marginLeft + this.yLabelAdjustment(),
        this.canvasWidth - rightMarginOrLegend
      ])

    this.xAxis = axisBottom()
      .scale(this.xScale)
      .tickSize(this.xTickSize)
      .tickFormat((d) => {
        return TickFormat(d, this.xTickFormat)
      })

    if (this.hideXTicks) {
      this.xAxis.tickValues([])
    }

    //////////////////////////////
    // Y axis
    //////////////////////////////
    this.yScale = scaleLinear()
      .domain([this.yMin, this.yMax])
      .range([
        this.canvasHeight - this.marginBottom - this.xLabelAdjustment(),
        this.marginTop
      ])

    this.yAxis = axisLeft()
      .scale(this.yScale)
      .tickSize(this.yTickSize)
      .tickFormat((d) => {
        return TickFormat(d, this.yTickFormat)
      })

    if (this.hideYTicks) {
      this.yAxis.tickValues([])
    }
  }

  /**
   * @function
   * Adjust for possible X-axis label
   */
  xLabelAdjustment(): number {
    return this.isValidXLabel() ? this.xLabelPadding : 0
  }

  /**
   * @function
   * Determine invalid X domain
   */
  xZeroDomain(): boolean {
    return this.xScale.domain()[0] === this.xScale.domain()[1]
      || Math.abs(this.xScale.domain()[0]) === Infinity
      || Math.abs(this.xScale.domain()[1]) === Infinity
  }

  /**
   * @function
   * Adjust for possible Y-axis label
   */
  yLabelAdjustment(): number {
    return this.isValidYLabel() ? this.yLabelPadding : 0
  }

  /**
   * @function
   * Determine invalid Y domain
   */
  yZeroDomain(): boolean {
    return this.yScale.domain()[0] === this.yScale.domain()[1] ||
      Math.abs(this.yScale.domain()[0]) === Infinity ||
      Math.abs(this.yScale.domain()[1]) === Infinity  
  }

  render() {
    return (
      <div>
        <div id="tooltip"></div>
        <svg version="1.1"
          baseProfile="full"
          width={this.canvasWidth}
          height={this.canvasHeight}
          class="stv-line-chart"
          xmlns="http://www.w3.org/2000/svg">
        </svg>
      </div>
    )
  }
}
