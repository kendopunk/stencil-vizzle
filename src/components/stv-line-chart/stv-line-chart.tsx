/**
 * src/components/stv-line-chart/stv-line-chart.tsx
 * component class
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
import { transition } from 'd3-transition'

import IfcStvLineChart from '../../interfaces/IfcStvLineChart'
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
  gCanvas: Selection<Element, any, HTMLElement, any>
  gGrid: Selection<Element, any, HTMLElement, any>
  gLegend: Selection<Element, any, HTMLElement, any>
  gXAxis: Selection<Element, any, HTMLElement, any>
  gYAxis: Selection<Element, any, HTMLElement, any>
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

  @Prop() axisFontSize: number = 9
  @Prop({
    reflectToAttr: true,
    mutable: true
  }) canvasHeight: number = 300
  @Prop({
    reflectToAttr: true,
    mutable: true
  }) canvasWidth: number = 500
  @Prop() chartData: IfcStvLineChart[] = [],
  @Prop() colorScheme: string = 'category10'
  @Prop() hideXAxis: boolean = false
  @Prop() hideXTicks: boolean = false
  @Prop() hideYAxis: boolean = false
  @Prop() hideYTicks: boolean = false
  @Prop() legend: boolean = false
  @Prop() legendWidth: number = 125
  @Prop({reflectToAttr: true}) marginBottom: number = 25
  @Prop({reflectToAttr: true}) marginLeft: number = 25
  @Prop({reflectToAttr: true}) marginRight: number = 25
  @Prop({reflectToAttr: true}) marginTop: number = 25
  @Prop() responsive: boolean = false
  @Prop() strokeWidth: number = 1
  @Prop() tooltips: boolean = false
  @Prop() vertices: boolean = false
  @Prop() xLabel: string
  @Prop() xMetric: string = 'x'
  @Prop() xTickFormat: string = 'raw'
  @Prop() xTickSize: number = 2
  @Prop() yLabel: string
  @Prop() yMetric: string = 'y'
  @Prop() yTickFormat: string = 'raw'
  @Prop() yTickSize: number = 2

  @Event({
    eventName: 'stv-line-chart-loaded'
  }) componentLoaded: EventEmitter

  ////////////////////////////////////////
  // LIFECYCLE
  ////////////////////////////////////////
  componentDidLoad(): void {
    this.svg = select(this.chartElement.shadowRoot.querySelector('svg.line-chart'))
    this.gCanvas = this.svg.append('svg:g').attr('class', 'canvas')
    this.gGrid = this.gCanvas.append('svg.g').attr('class', 'grid')
    this.gLegend = this.svg.append('svg:g').attr('class', 'legend')
    this.gXAxis = this.gCanvas.append('svg:g')
      .attr('class', 'axis')
      .style('opacity', 0)
      .style('font-size', `${this.axisFontSize}px`)
    this.gXAxis = this.gCanvas.append('svg:g')
      .attr('class', 'axis')
      .style('opacity', 0)
      .style('font-size', `${this.axisFontSize}px`)
    this.tooltipDiv = select(this.chartElement.shadowRoot.querySelector('#tooltip'))
      .attr('class', 'tooltip')
      .style('opacity', 0)

    // responsive
    if (this.responsive) {
      this.canvasWidth = this.chartElement.parentElement.getBoundingClientRect().width
      this.canvasHeight = this.chartElement.parentElement.getBoundingClientRect().height
    }

    this.colorScale = scaleOrdinal()

    this.componentLoaded.emit({
      component: 'stv-line-chart',
      id: this.id
    })

    if (this.isValidChartData()) {
      this.draw()
    }
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
    if (this.responsive && this.isValidChartData()) {
      this.canvasWidth = this.chartElement.parentElement.getBoundingClientRect().width
      // this.canvasHeight = this.chartElement.parentElement.getBoundingClientRect().height
      this.draw()
    }
  }

  ////////////////////////////////////////
  // CLASS METHODS
  ////////////////////////////////////////

  /**
   * @function
   * Call the generators for the axes
   */
  callAxes(): void {
    this.gXAxis
      .style('font-size', `${this.axisFontSize}px`)
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
      .style('font-size', `${this.axisFontSize}px`)
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
   * Wrapper method for the various render methods
   */
  draw(): void {
    this.setScales()
    this.callAxes()
    this.setColorScale()
    this.handlePaths()
    this.handleAxisLabels()
    this.handleVertices()
    this.handleLegend()
  }

  /**
   * @function
   * Handle X/Y axis labels
   */
  handleAxisLabels(): void {
    const t = transition().duration(100)

    // X
    if (this.isValidXLabel()) {
      this.gCanvas.selectAll('text.x-axis-label').remove()

      this.gCanvas.selectAll('text')
        .attr('class', 'x-axis-label')
        .style('text-anchor', 'middle')
        .text(this.xLabel)
        .attr('transform', () => {
          const x = this.marginLeft +
            this.yLabelAdjustment() +
            (this.xScale.range()[1] - this.xScale.range()[0])/2

          const y = this.canvasHeight - this.xLabelPadding/2

          return `translate(${x}, ${y})`
        })
    } else {
      this.gCanvas.selectAll('text.x-axis-label')
        .transition(t)
        .style('opacity', 0)
        .remove()
    }

    // Y
    if (this.isValidYLabel()) {
      this.gCanvas.append('text')
        .attr('class', 'y-axis-label')
        .style('text-anchor', 'middle')
        .text(this.yLabel)
        .attr('transform', () => {
          const x = this.xLabelPadding/2

          const y = this.marginTop +
            (this.canvasHeight - this.marginBottom - this.marginTop - this.xLabelAdjustment())/2

          return `translate(${x}, ${y}), rotate(-90)`
        })
    } else {
      this.gCanvas.selectAll('text.y-axis-label')
        .transition(t)
        .style('opacity', 0)
        .remove()
    }
  }

  /**
   * @function
   * Optional legend
   */
  handleLegend(): void {
    const t100 = transition().duration(100)
    const lineIncrement = 25

    // transform "gLegend" grouping
    this.gLegend.attr('transform', () => {
      const x = this.canvasWidth - this.legendWidth
      const y = this.marginTop

      return `translate(${x}, ${y})`
    })

    // legend prop is in play
    if (this.legend) {
      
      //////////////////////////////
      // legend lines
      //////////////////////////////
      const lineSel = this.gLegend.selectAll('line.legend-line')
        .data(this.chartData)

      lineSel.exit().remove()

      lineSel.enter()
        .append('line')
        .attr('x', 0)
        .attr('x2', 10)
        .style('opacity', 0.7)
        .style('stroke-width', 3)
        .merge(lineSel)
        .transition(t100)
        .attr('y1', (_d, i) => {
          return i * lineIncrement
        })
        .attr('y2', (_d, i) => {
          return i * lineIncrement
        })
        .style('stroke', (d, i) => {
          return d.color || this.colorScale(i)
        })

      //////////////////////////////
      // legend text
      //////////////////////////////
      const textSel = this.gLegend.selectAll('text.legend-text')
        .data(this.chartData)

      textSel.exit().remove()

      textSel.enter()
        .append('text')
        .attr('class', 'legend-text')
        .style('fill', '#555')
        .on('mouseover', (_d, i) => {
          this.gCanvas.selectAll('path.main')
            .filter((_e, j) => {
              return i === j
            })
            .style('opacity', 1)
            .style('stroke-width', this.strokeWidth + 2)
        })
        .on('mouseout', (_d, i) => {
          this.gCanvas.selectAll('path.main')
            .filter((_e, j) => {
              return i === j
            })
            .style('opacity', 0.7)
            .style('stroke-width', this.strokeWidth)
        })
        .merge(textSel)
        .text((d) => {
          return d.label || ''
        })
        .transition(t100)
        .attr('x', 15)
        .attr('y', (_d, i) => {
          return i * lineIncrement + 4
        })
    } else {
      this.gLegend.selectAll('line.legend-line')
        .style('opacity', 0)
        .remove()

      this.gLegend.selectAll('text.legend-text')
        .style('opacity', 0)
        .remove()
    }
  }

  /**
   * @function
   * Call the path generator
   */
  handlePaths(): void {
    const t1 = transition().duration(250)

    // @TODO: Interpolator options ?
    const lineFn = line()
      .x((d) => {
        return this.xScale(d[this.xMetric])
      })
      .y((d) => {
        return this.yScale(d[this.yMetric])
      })

    const pathSelection = this.gCanvas.selectAll('path.main')
      .data(this.chartData)

    pathSelection.exit().remove()

    pathSelection.enter()
      .append('path')
      .attr('class', 'main')
      .style('fill', 'none')
      .style('opacity', 0.7)
      .merge(pathSelection)
      .style('stroke', (d, i) => {
        return d.color || this.colorScale(i)
      })
      .style('stroke-width', this.strokeWidth)
      .transition(t1)
      .attr('d', (d) => {
        return lineFn(d.data)
      })
  }

  /**
   * @function
   * Circular vertices
   */
  handleVertices(): void {
    const t100 = transition().duration(100)
    const t300 = transition().duration(300)

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
          return '<b>' +
            TickFormat(d[this.xMetric], this.xTickFormat) +
            '<b><br />' +
            TickFormat(d[this.yMetric], this.yTickFormat)
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
      .transition(t300)
      .style('opacity', 1)
  }

  /**
   * @function
   * Determine chartData validity
   */
  isValidChartData(): boolean {
    return isArray(this.chartData) &&
      this.chartData.length > 0 &&
      isArray(this.chartData[0].data)
  }

  isValidXLabel(): boolean {
    return this.xLabel && this.xLabel.length > 0 && !this.hideXAxis
  }

  isValidYLabel(): boolean {
    return this.yLabel && this.yLabel.length > 0 && !this.hideYAxis
  }

  /**
   * @function
   * Set X/Y scales and axis generators
   */
  setScales(): void {
    this.xMin = Math.min(...this.chartData.map((m) => {
      return m.data.map((m2) => {
        return m2[this.xMetric]
      })
    }).flat())

    this.xMax = Math.max(...this.chartData.map((m) => {
      return m.data.map((m2) => {
        return m2[this.xMetric]
      })
    }).flat())

    this.yMin = Math.min(...this.chartData.map((m) => {
      return m.data.map((m2) => {
        return m2[this.yMetric]
      })
    }).flat())

    this.yMax = Math.max(...this.chartData.map((m) => {
      return m.data.map((m2) => {
        return m2[this.yMetric]
      })
    }).flat())

    // X
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

    if (this.hideXTickValues) {
      this.xAxis.tickValues([])
    }

    // Y
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

    if (this.hideYTickValues) {
      this.yAxis.tickValues([])
    }
  }

  xLabelAdjustment(): number {
    return this.isValidXLabel() ? this.xLabelPadding : 0
  }

  xZeroDomain(): boolean {
    return this.xScale.domain()[0] === this.xScale.domain()[1] ||
      Math.abs(this.xScale.domain()[0]) === Infinity ||
      Math.abs(this.xScale.domain()[1]) === Infinity
  }

  yLabelAdjustment(): number {
    return this.isValidYLabel() ? this.yLabelPadding : 0
  }

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
          class="line-chart"
          xmlns="http://www.w3.org/2000/svg">
        </svg>
      </div>
    )
  }
}
