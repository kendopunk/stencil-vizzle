/**
 * src/components/stv-stacked-bar-chart/stv-stacked-bar-chart.tsx
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
import reverse from 'lodash/reverse'
import uniq from 'lodash/uniq'
import { event, max } from 'd3'
import { axisBottom, axisLeft } from 'd3-axis'
import {
  scaleBand,
  scaleOrdinal,
  scaleLinear
} from 'd3-scale'
import {
  schemeCategory10,
  schemeAccent,
  schemePaired,
  schemeSet1,
  schemeSet2,
  schemeSet3
} from 'd3-scale-chromatic'
import { Selection, select } from 'd3-selection'
import { stack, stackOrderReverse } from 'd3-shape'

// interface
import { IfcStvStackedBarChart } from '../../interfaces/IfcStvStackedBarChart'

// utilities
import {
  t50,
  t100,
  t250
} from '../../utils/transition_definitions'
import TickFormat from '../../utils/tickformat'

@Component({
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

  // <g>
  gCanvas: Selection<Element, any, HTMLElement, any>
  gGrid: Selection<Element, any, HTMLElement, any>
  gLegend: Selection<Element, any, HTMLElement, any>
  gXAxis: Selection<Element, any, HTMLElement, any>
  gYAxis: Selection<Element, any, HTMLElement, any>
  // end </g>

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
  @Prop() chartData: IfcStvStackedBarChart[] = []
  @Prop() chartId: string = ''
  @Prop() colorScheme: string = 'category10'
  @Prop() gridlines: boolean = false
  @Prop() hideXAxis: boolean = false
  @Prop() hideXTicks: boolean = false
  @Prop() hideYAxis: boolean = false
  @Prop() hideYTicks: boolean = false
  @Prop() legend: boolean = false
  @Prop() legendFontSize: number = 12
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
  @Prop() tooltips: boolean = true
  @Prop() xLabel: string = ''
  @Prop() xTickSize: number = 2
  @Prop() yLabel: string = ''
  @Prop() yTickSize: number = 2

  @Event({
    eventName: 'stv-stacked-bar-chart-loaded',
    bubbles: true,
    composed: true
  }) componentLoaded: EventEmitter

  ////////////////////////////////////////
  // LIFECYCLE
  ////////////////////////////////////////
  componentDidLoad(): void {
    this.svg = select(this.chartElement.shadowRoot.querySelector('svg.stv-stacked-bar-chart'))
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
      component: 'stv-stacked-bar-chart',
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
    // X = linear
    this.gXAxis.style('font-size', `${this.axisTickFontSize}px`)
      .attr('transform', () => {
        if (this.chartData.length === 0) {
          return
        }

        const x = this.marginLeft
          + this.yLabelAdjustment()
        const y = this.canvasHeight
          - this.marginBottom
          - this.xLabelAdjustment()
         return `translate(${x}, ${y})`
      })
      .style('opacity', () => {
        return this.hideXAxis || this.chartData.length === 0 ? 0 : 1
      })
      .call(this.xAxis)

    // Y = ordinal
    this.gYAxis.style('font-size', `${this.axisTickFontSize}px`)
      .attr('transform', () => {
        if (this.chartData.length === 0) {
          return
        }

        const x = this.marginLeft
          + this.yLabelAdjustment()
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
    // X = ordinal
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

    // Y = linear
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
   * Wrapper function for individual drawing methods
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
    this.handleGridlines()
    this.handleAxisLabels()
    this.handleLegend()
  }

  /**
   * @function
   * Get a unique array of all ordinal keys
   */
  getOrdinalKeys(): Array<string> {
    return uniq(this.chartData.map((m) => {
      return m[this.ordinalMetric]
    })).sort()
  }

  /**
   * @function
   * Get a unique list of all series keys
   */
  getSeriesKeys(): Array<string> {
    return uniq(this.chartData.map((m) => {
      return m[this.seriesMetric]
    })).sort()
  }

  /**
   * @function
   * Optional labels for X/Y axes
   */
  handleAxisLabels(): void {

    // X-axis
    // take into account left/right margins and
    // possible Y-axis label padding
    if (this.isValidXLabel()) {
      this.gCanvas.selectAll('text.x-axis-label').remove()

      this.gCanvas.append('text')
        .attr('class', 'x-axis-label')
        .style('text-anchor', 'middle')
        .style('font-size', `${this.axisLabelFontSize}px`)
        .text(this.xLabel)
        .attr('transform', () => {
          // x depends on orientation
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

    // Y-axis
    // take into account top/bottom margins
    // and possible X axis label padding
    if (this.isValidYLabel()) {
      this.gCanvas.selectAll('text.y-axis-label').remove()

      this.gCanvas.append('text')
        .attr('class', 'y-axis-label')
        .style('text-anchor', 'middle')
        .style('font-size', `${this.axisLabelFontSize}px`)
        .text(this.yLabel)
        .attr('transform', () => {
          const x = this.yLabelPadding/2
          const y = this.marginTop
            + (this.canvasHeight - this.marginBottom - this.marginTop - this.xLabelAdjustment())/2
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
   * Mouse event handler for layered bars
   */
  handleBarMouseEvent(mouseOpt, _d): void {
    const barNode = this.gCanvas.selectAll('rect.bar').filter((e) => {
      return _d === e
    }).node()

    if (mouseOpt === 'mouseover') {
      barNode.style.opacity = 1
      const series = barNode.parentNode.getAttribute('series') || ''
      const diff = _d[1] - _d[0]

      this.tooltipDiv
        .style('left', () => {
          return `${event.pageX}px`
        })
        .style('top', () => {
          return `${event.pageY}px`
        })
        .style('opacity', () => {
          return this.tooltips ? 0.9 : 0
        })
        .html(() => {
          return '<div class="key">'
            + `${series}`
            + '</div><div class="value">'
            + TickFormat(diff, this.linearTickFormat)
            + '</div>'
        })
    }

    if (mouseOpt === 'mouseout') {
      barNode.style.opacity = this.layerOpacity
      this.tooltipDiv.style('opacity', 0).html('')
    }

    if (mouseOpt === 'mousemove') {
      this.tooltipDiv
        .style('left', () => {
          return `${event.pageX}px`
        })
        .style('top', () => {
          return `${event.pageY + 15}px`
        })
    }
  }

  /**
   * @function
   * Render grid lines, depending on orientation
   * Scales must be set before this will work properly and it should be called
   * before drawing bars, due to z-index nature of SVG rendering
   */
  handleGridlines(): void {

    if (!this.gridlines) {
      this.gGrid.selectAll('line.gridline').remove()
      return;
    }

    const gridSelection = this.gGrid.selectAll('line.gridline')
      .data(this.linearScale.ticks())

    gridSelection.exit().remove()

    const sel = gridSelection.enter()
      .append('svg:line')
      .attr('class', 'gridline')
      .style('stroke', '#bbb')
      .style('stroke-width', 0.5)
      .style('stroke-dasharray', ("7,3"))

    if (this.orientation === 'horizontal') {
      sel.merge(gridSelection)
        .attr('x1', (d) => {
          return this.marginLeft
            + this.yLabelAdjustment()
            + this.linearScale(d)
        })
        .attr('x2', (d) => {
          return this.marginLeft
            + this.yLabelAdjustment()
            + this.linearScale(d)
        })
        .attr('y1', this.marginTop)
        .transition(t250)
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
        .transition(t250)
        .attr('x2', () => {
          return this.canvasWidth
            - this.marginRight
            - this.legendAdjustment()
        })
    }
  }

  /**
   * @function
   * Draw bars for horizontal orientation
   */
  handleHorizontalBars(): void {
    //////////////////////////////
    // layers
    //////////////////////////////
    const layerSel = this.gCanvas.selectAll('.layer')
      .data(this.layers)

    layerSel.exit().remove()

    const mergedLayers = layerSel.enter()
      .append('g')
      .attr('class', 'layer')
      .attr('series', (d) => {
        return d.key
      })
      .merge(layerSel)
      .style('fill', (d) => {
        return this.colorScale(d.key)
      })

    //////////////////////////////
    // bars
    //////////////////////////////
    const barSel = mergedLayers.selectAll('rect.bar')
      .data((d) => {
        return d
      })

    barSel.exit()
      .transition(t50)
      .style('opacity', 0)
      .remove()

    barSel.enter()
      .append('rect')
      .attr('rx', 3)
      .attr('ry', 3)
      .attr('class', 'bar')
      .style('opacity', 0)
      .on('mouseover', (d) => {
        this.handleBarMouseEvent('mouseover', d)
      })
      .on('mouseout', (d) => {
        this.handleBarMouseEvent('mouseout', d)
      })
      .on('mousemove', (d) => {
        this.handleBarMouseEvent('mousemove', d)
      })
      .merge(barSel)
      .style('stroke', this.barStroke)
      .style('stroke-width', this.barStrokeWidth)
      .transition(t100)
      .attr('x', (d) => {
        return this.marginLeft
          + this.yLabelAdjustment()
          + this.linearScale(d[0])
      })
      .attr('y', (d) => {
        return this.ordinalScale(d.data[this.ordinalMetric])
          + this.ordinalScale.bandwidth()/2
          - Math.min(this.maxBarWidth, this.ordinalScale.bandwidth())/2
      })
      .attr('height', () => {
        return Math.min(this.maxBarWidth, this.ordinalScale.bandwidth())
      })
      .attr('width', (d) => {
        return this.linearScale(d[1])
          - this.linearScale(d[0])
      })
      .transition(t100)
      .style('opacity', this.layerOpacity)
  }

  /**
   * @function
   * Optional legend
   */
  handleLegend(): void {
    const lineIncrement = 25

    // adjust position of "gLegend"
    this.gLegend.attr('transform', () => {
      const x = this.canvasWidth - this.legendWidth
      const y = this.marginTop
      return `translate(${x}, ${y})`
    })

    // legend is in play
    if (this.legend) {

      //////////////////////////////
      // legend lines
      //////////////////////////////
      const lineSel = this.gLegend.selectAll('line.legend-line')
        .data(this.layers)

      lineSel.exit().remove()

      lineSel.enter()
        .append('line')
        .attr('class', 'legend-line')
        .attr('x1', 0)
        .attr('x2', 10)
        .style('opacity', 0)
        .style('stroke-width', 3)
        .merge(lineSel)
        .transition(t100)
        .attr('y1', (_d, i) => {
          return i * lineIncrement
        })
        .attr('y2', (_d, i) => {
          return i * lineIncrement
        })
        .style('stroke', (d) => {
          return this.colorScale(d.key)
        })
        .transition(t100)
        .style('opacity', this.layerOpacity)

      //////////////////////////////
      // legend text
      //////////////////////////////
      const textSel = this.gLegend.selectAll('text.legend-text')
        .data(this.layers)

      textSel.exit().remove()

      textSel.enter()
        .append('text')
        .attr('class', 'legend-text')
        .style('fill', '#555')
        .style('opacity', 0)
        .style('font-size', `${this.legendFontSize}px`)
        .on('mouseover', (d) => {
          this.gCanvas.selectAll('.layer')
            .filter((e) => {
              return d.key === e.key
            })
            .selectAll('rect.bar')
            .style('opacity', 1)

          this.gCanvas.selectAll('.layer')
            .filter((e) => {
              return d.key !== e.key
            })
            .selectAll('rect.bar')
            .style('opacity', 0.3)
        })
        .on('mouseout', () => {
          this.gCanvas.selectAll('.layer')
            .selectAll('rect.bar')
            .style('opacity', this.layerOpacity)
        })
        .merge(textSel)
        .transition(t100)
        .text((d) => {
          return d.key
        })
        .attr('x', 15)
        .attr('y', (_d, i) => {
          return i * lineIncrement + 4
        })
        .transition(t100)
        .style('opacity', this.layerOpacity)
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

  /**
   * @function
   * Draw bars, vertical (default) orientation
   */
  handleVerticalBars(): void {

    const layerSel = this.gCanvas.selectAll('.layer')
      .data(this.layers)

    layerSel.exit().remove()

    const mergedLayers = layerSel.enter()
      .append('g')
      .attr('class', 'layer')
      .attr('series', (d) => {
        return d.key
      })
      .merge(layerSel)
      .style('fill', (d) => {
        return this.colorScale(d.key)
      })

    const barSel = mergedLayers.selectAll('rect.bar')
      .data((d) => {
        return d
      })

    barSel.exit()
      .transition(t50)
      .style('opacity', 0)
      .remove()

    barSel.enter()
      .append('rect')
      .attr('rx', 3)
      .attr('ry', 3)
      .attr('class', 'bar')
      .style('opacity', 0)
      .on('mouseover', (d) => {
        this.handleBarMouseEvent('mouseover', d)
      })
      .on('mouseout', (d) => {
        this.handleBarMouseEvent('mouseout', d)
      })
      .on('mousemove', (d) => {
        this.handleBarMouseEvent('mousemove', d)
      })
      .merge(barSel)
      .style('stroke', this.barStroke)
      .style('stroke-width', this.barStrokeWidth)
      .transition(t100)
      .attr('x', (d) => {
        return this.marginLeft
          + this.ordinalScale(d.data[this.ordinalMetric])
          + this.ordinalScale.bandwidth()/2
          - Math.min(this.maxBarWidth, this.ordinalScale.bandwidth())/2
      })
      .attr('y', (d) => {
        return this.linearScale(d[1])
      })
      .attr('height', (d) => {
        return this.linearScale(d[0])
          - this.linearScale(d[1])
      })
      .attr('width', () => {
        return Math.min(this.maxBarWidth, this.ordinalScale.bandwidth())
      })
      .transition(t100)
      .style('opacity', this.layerOpacity)
  }

  /**
   * @function
   * "chartData" should be an array
   */
  isValidChartData(): boolean {
    return isArray(this.chartData)
  }

  isValidXLabel(): boolean {
    return this.xLabel
      && this.xLabel.length > 0
      && !this.hideXAxis
  }

  isValidYLabel(): boolean {
    return this.yLabel
      && this.yLabel.length > 0
      && !this.hideYAxis
  }

  /**
   * @function
   * Calculate potential X adjustment for legend
   */
  legendAdjustment(): number {
    return this.legend ? this.legendWidth : 0
  }

  /**
   * @function
   * Setting the color scale to use for bars
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
   * Calculate scales and axis generators for horizontal layout
   * X-axis = linear
   * Y-axis = ordinal
   */
  setHorizontalScales(): void {
    const series = this.toSeriesFormat()
    this.layers = this.toStackFormat()

    // X = linear
    this.linearScale = scaleLinear()
      .domain([
        0,
        max(series, (d) => d.total)
      ])
      .range([
        0,
        this.canvasWidth
          - this.marginLeft
          - this.marginRight
          - this.legendAdjustment()
          - this.yLabelAdjustment()
      ])
      .nice()

    this.xAxis.scale(this.linearScale)
      .tickSize(this.xTickSize)
      .tickValues(this.hideXTicks ? [] : null)
      .tickFormat((d) => {
        return TickFormat(d, this.linearTickFormat)
      })

    // Y = ordinal
    this.ordinalScale = scaleBand()
      .domain(reverse(this.getOrdinalKeys()))
      .rangeRound([
        this.canvasHeight
          - this.marginBottom
          - this.xLabelAdjustment(),
        this.marginTop
      ])
      .padding(0.1)

    this.yAxis.scale(this.ordinalScale)
      .tickSize(this.yTickSize)
      .tickValues(this.hideYTicks ? [] : null)
      .tickFormat((d) => {
        return TickFormat(d, 'raw')
      })
  }

  /**
   * @function
   * Calculate scales and axis generators for vertical (default) orientation
   */
  setVerticalScales(): void {
    const series = this.toSeriesFormat()
    this.layers = this.toStackFormat()

    // X = ordinal
    this.ordinalScale = scaleBand()
      .domain(this.getOrdinalKeys())
      .rangeRound([
        this.yLabelAdjustment(),
        this.canvasWidth
          - this.marginLeft
          - this.marginRight
          - this.legendAdjustment()
      ])
      .padding(0.1)

    this.xAxis.scale(this.ordinalScale)
      .tickSize(this.xTickSize)
      .tickValues(this.hideXTicks ? [] : null)
      .tickFormat((d) => {
        return TickFormat(d, 'raw')
      })

    // Y = linear
    this.linearScale = scaleLinear()
      .domain([
        0,
        max(series, (d) => { return d.total })
      ])
      .range([
        this.canvasHeight
          - this.marginBottom
          - this.xLabelAdjustment(),
        this.marginTop
      ])
      .nice()

    this.yAxis.scale(this.linearScale)
      .tickSize(this.yTickSize)
      .tickValues(this.hideYTicks ? [] : null)
      .tickFormat((d) => {
        return TickFormat(d, this.linearTickFormat)
      })
  }

  /**
   * @function
   * Format chartData into series formatting
   */
  toSeriesFormat(): Array<any> {
    let ret = []

    this.getOrdinalKeys().forEach((item) => {
      let total = 0
      const obj = {[`${this.ordinalMetric}`]: item}

      this.chartData.filter((f) => {
        return f[this.ordinalMetric] === item
      }).forEach((entry) => {
        let k = entry[this.seriesMetric]
        obj[`${k}`] = entry[this.linearMetric]

        total += entry[this.linearMetric]
      })

      ret.push(Object.assign({}, obj, {total}))
    })

    // converting absolute values to % values
    if (this.linearDomain === 'percent') {
      ret.forEach((m) => {
        Object.keys(m).forEach((k) => {
          if (k !== 'total' && k !== this.ordinalMetric) {
            m[`${k}`] = (m[k]/m.total) * 100
          }
        })
        m.total = 100
      })
    }

    return ret
  }

  /**
   * @function
   * Convert chartData to a format that can be consumed
   * by the D3.js stack layout function
   */
  toStackFormat(): Array<any> {
    return stack()
      .keys(this.getSeriesKeys())
      .order(stackOrderReverse)(this.toSeriesFormat())
  }

  xLabelAdjustment(): number {
    return this.isValidXLabel() ? this.xLabelPadding : 0
  }

  yLabelAdjustment(): number {
    return this.isValidYLabel() ? this.yLabelPadding : 0
  }

  render() {
    return (
      <div>
        <div id="tooltip"></div>
        <svg id={this.chartId}
          version="1.1"
          baseProfile="full"
          width={this.canvasWidth}
          height={this.canvasHeight}
          class="stv-stacked-bar-chart"
          xmlns="http://www.w3.org/2000/svg">
        </svg>
      </div>
    )
  }
}
