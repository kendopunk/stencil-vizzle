/**
 * src/components/stv-pie-chart/stv-pie-chart.tsx
 * Pie chart component class
 */
import {
  Component,
  h,
  Element,
  Listen
} from '@stencil/core'
import { event } from 'd3'
import { scaleOrdinal } from 'd3-scale'
import {
  schemeCategory10,
  schemeAccent,
  schemePaired,
  schemeSet1,
  schemeSet2,
  schemeSet3
} from 'd3-scale-chromatic'
import { select } from 'd3-selection'
import { arc, pie } from 'd3-shape'

// utilities
import { calculateLegendLabelClass } from '../../utils/css_utils'
import TickFormat from '../../utils/tickformat'
import {
  t25,
  t50,
  t100,
  t500
} from '../../utils/transition_definitions'

@Component({
  tag: 'stv-pie-chart',
  styleUrl: 'stv-pie-chart.scss',
  shadow: true
})

export class StvPieChart {
  arcObject: any
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
  defaultArcOpacity: number = 0.8
  defaultLineOpacity: number = 0.7
  pieLayout: any = pie()
  spaceBetweenPieAndLegend: number = 25

  @Element() private chartElement: HTMLElement

  @Prop({
    reflectToAttr: true,
    mutable: true
  }) canvasHeight: number = 450
  @Prop({
    reflectToAttr: true,
    mutable: true
  }) canvasWidth: number = 450
  @Prop() chartData: any = []
  @Prop() chartId: string = ''
  @Prop() colorScheme: string = 'category10'
  @Prop() innerRadius: number = 0
  @Prop() inverse: boolean = false
  @Prop() legend: boolean = false
  @Prop() legendFontSize: number = 12
  @Prop() legendMetric: string = 'label'
  @Prop() legendWidth: number = 125
  @Prop({reflectToAttr: true}) marginBottom: number = 0
  @Prop({reflectToAttr: true}) marginLeft: number = 0
  @Prop({reflectToAttr: true}) marginRight: number = 0
  @Prop({reflectToAttr: true}) marginTop: number = 0
  @Prop() responsive: boolean = false
  @Prop() stroke: string = 'transparent'
  @Prop() strokeWidth: number = 1
  @Prop() tooltips: boolean = false
  @Prop() valueFormat: string = 'raw'
  @Prop() valueMetric: string = 'value'

  @Event({
    eventName: 'stv-pie-chart-loaded',
    bubbles: true,
    composed: true
  }) componentLoaded: EventEmitter

  ////////////////////////////////////////
  // LIFECYCLE
  ////////////////////////////////////////
  componentDidLoad(): void {
    this.svg = select(this.chartElement.shadowRoot.querySelector('svg.stv-pie-chart'))

    this.gCanvas = this.svg.append('svg:g')
      .attr('class', 'canvas')

    this.gPie = this.gCanvas.append('svg:g')

    this.gLegend = this.svg.append('svg:g')
      .attr('class', 'legend')

    this.tooltipDiv = select(this.chartElement.shadowRoot.querySelector('#tooltip'))
      .attr('class', 'tooltip')
      .style('opacity', 0)

    // responsive configuration
    if (this.responsive) {
      this.canvasHeight = this.chartElement.parentElement.getBoundingClientRect().height
      this.canvasWidth = this.chartElement.parentElement.getBoundingClientRect().width
    }

    // color scale, if "color" property not bound in data
    this.colorScale = scaleOrdinal()

    // emit component loaded event
    this.componentLoaded.emit({
      component: 'stv-pie-chart',
      chartId: this.chartId
    })
  }

  ////////////////////////////////////////
  // LIFECYCLE
  ////////////////////////////////////////
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
  calculateDrawableHeight(): number {
    return this.canvasHeight - this.marginTop - this.marginBottom
  }

  calculateDrawableWidth(): number {
    let w = this.canvasWidth - this.marginLeft - this.marginRight
    if (this.legend) {
      w = w - this.legendWidth - this.spaceBetweenPieAndLegend
    }
    return w
  }

  draw(): void {
    this.setColorScale()
    this.handlePie()
    this.handleLegend()
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
      const y = lineIncrement

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
        .on('mouseover', (_d, i) => {
          this.gCanvas.selectAll('path.wedge')
            .filter((_e, j) => {
              return i === j
            })
            .style('opacity', 1)
            .style('stroke-width', this.strokeWidth + 2)
        })
        .on('mouseout', (_d, i) => {
          this.gCanvas.selectAll('path.wedge')
            .filter((_e, j) => {
              return i === j
            })
            .style('opacity', this.defaultArcOpacity)
            .style('stroke-width', this.strokeWidth)
        })
        .merge(textSel)
        .attr('class', calculateLegendLabelClass(this.inverse))
        .style('font-size', `${this.legendFontSize}px`)
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
      this.gLegend.selectAll('line.legend-line').remove()
      this.gLegend.selectAll('text').remove()
    }
  }


  /**
   * @function
   * Handle the arcs and paths
   */
  handlePie(): void {
    // translate gCanvas
    this.gCanvas.attr('transform', () => {
      const w = this.calculateDrawableWidth()/2 + (this.marginLeft + this.marginRight)/2
      const h = this.calculateDrawableHeight()/2 + (this.marginTop + this.marginBottom)/2
      return `translate(${w}, ${h})`
    })

    // set the arc object
    this.arcObject = arc()
      .outerRadius(() => {
        return Math.min(this.calculateDrawableWidth()/2, this.calculateDrawableHeight()/2)
      })
      .innerRadius(() => {
        return Math.min(this.calculateDrawableWidth()/2, this.calculateDrawableHeight()/2) * this.innerRadius
      })

    // configure pieLayout generator
    this.pieLayout.value((d) => {
      return d[this.valueMetric]
    }).sort(null)

    ////////////////////////////////////////
    // JRAT
    ////////////////////////////////////////
    // join new arcs with old arcs
    const arcSelection = this.gPie.selectAll('g.arc')
      .data(this.pieLayout(this.chartData))

    // remove old arcs gracefully
    arcSelection.exit()
      .transition(t100)
      .style('opacity', 0)
      .remove()

    // add new arcs
    const newArcs = arcSelection.enter()
      .append('svg:g')
      .attr('class', 'arc')

    // append path to each new arc
    newArcs.append('path')
      .attr('class', 'wedge')
      .style('opacity', 0)
      .style('fill', 'transparent')
      .style('stroke-width', this.strokeWidth)
      .attr('d', arc().outerRadius(0).innerRadius(0))  // overidden later
      .on('mouseover', (d) => {
        this.tooltipDiv
          .style('left', () => {
            return `${event.pageX}px`
          })
          .style('top', () => {
            return `${event.pageY + 15}px`
          })
          .style('opacity', () => {
            return this.tooltips ? 0.9 : 0
          })
          .html(() => {
            return '<div class="key">'
              + d.data[this.legendMetric]
              + '</div><div class="value">'
              + TickFormat(d.data[this.valueMetric])
              + '</div>'
          })
      })
      .on('mouseout', () => {
        this.tooltipDiv.style('opacity', 0).html('')
      })
      .on('mousemove', () => {
        this.tooltipDiv
          .style('left', `${event.pageX}px`)
          .style('top', `${event.pageY + 15}px`)
      })

    // bind data and transition paths
    this.gPie.selectAll('g.arc path')
      .data(this.pieLayout(this.chartData))
      .attr('d', this.arcObject)
      .transition(t500)
      .style('stroke', this.stroke)
      .style('stroke-width', this.strokeWidth)
      .style('fill', (d, i) => {
        return d.color || this.colorScale(i)
      })
      .style('opacity', this.defaultArcOpacity)
  }

  /**
   * @function
   * Determine if chartData is valid format
   */
  isValidChartData(): boolean {
    return this.chartData.length > 0
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

  render() {
    return (
      <div>
        <div id="tooltip"></div>
        <svg version="1.1"
          baseProfile="full"
          width={this.canvasWidth}
          height={this.canvasHeight}
          class="stv-pie-chart"
          xmlns="http://www.w3.org/2000/svg">
        </svg>
      </div>
    )
  }
}