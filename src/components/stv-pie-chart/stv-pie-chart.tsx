/**
 * src/components/stv-pie-chart/stv-pie-chart.tsx
 * Pie chart component class
 */
import {
  Component,
  h,
  Element
} from '@stencil/core'
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

@Component({
  tag: 'stv-pie-chart',
  styleUrl: 'stv-pie-chart.scss',
  shadow: true
})

export class StvPieChart {
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
  pieFn: any = pie()

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
  @Prop() legend: boolean = false
  @Prop() legendFontSize: number = 12
  @Prop() legendMetric: string = 'label'
  @Prop() legendWidth: number = 125
  @Prop() responsive: boolean = false

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
  draw(): void {
    this.setColorScale()

    this.gCanvas.attr('transform', () => {
      return `translate(${this.canvasWidth/2}, ${this.canvasHeight/2})`
    })


    const arcObject = arc()
      .outerRadius(() => {
        return Math.min(this.canvasHeight, this.canvasWidth)/2
      })
      .innerRadius(() => {
        return Math.min(Math.min(this.canvasHeight, this.canvasWidth)/2, this.innerRadius)
      })

    this.pieFn.value((d) => {
      return d.value
    })

    const arcSelection = this.gPie.selectAll('g.arc')
      .data(this.pieFn(this.chartData))

    arcSelection.exit().remove()

    const newArcs = arcSelection.enter()
      .append('g')
      .attr('class', 'arc')

    newArcs.append('path')
      .attr('d', arc().outerRadius(150).innerRadius(0)); // overidden later

    this.gPie.selectAll('.arc path')
      .data(this.pieFn(this.chartData))
      .style('fill', (d, i) => {
        console.log(i)
        return d.color || this.colorScale(i)
      })
      .attr('d', arcObject)
      .style('stroke', '#fff')


      /**
    
    //////////////////////////////////////////////////
    // append new arcs
    //////////////////////////////////////////////////
    var newArcs = arcSelection.enter()
      .append('g')
      .attr('class', 'arc')
      .on('mouseover', function(d, i) {
        me.handleMouseEvent(this, 'arc', 'mouseover', d, i);
      })
      .on('mouseout', function(d, i) {
        me.handleMouseEvent(this, 'arc', 'mouseout', d, i);
      });
    
    //////////////////////////////////////////////////
    // append paths to new arcs
    //////////////////////////////////////////////////
    newArcs.append('path')
      .style('opacity', me.opacities.arc.default)
      .style('fill', '#FFFFFF')
      .attr('d', d3.svg.arc().outerRadius(0).innerRadius(0)); // overidden later
    
    //////////////////////////////////////////////////
    // bind data and transition paths
    //////////////////////////////////////////////////
    me.gPie.selectAll('.arc path')
      .data(me.pieLayout(me.graphData))
      .transition()
      .duration(250)
      .style('fill', function(d, i) {
        if(hashedColorScale != null) {
          return hashedColorScale[d.data[hashedColorIndex]];
        } else if(indexedColorScale.length > 0) {
          return indexedColorScale[i];
        } else {
          return colorScale(i);
        }
      })
      .attr('d', me.arcObject);
    
    //////////////////////////////////////////////////
    // call / recall the tooltip function
    //////////////////////////////////////////////////
    me.gPie.selectAll('.arc').call(d3.helper.tooltip().text(me.tooltipFunction));*/

    

    // const dataReady = this.pieFn(this.chartData)

    // this.gCanvas.selectAll('.fap')

    // this.gCanvas.selectAll('whatever')
    //   .data(dataReady)
    //   .enter()
    //   .append('path')
    //   .attr('d', arc().innerRadius(0).outerRadius(150))
    //   .attr('fill', '#badcdc')
    //   .attr("stroke", "black")
    //   .style("stroke-width", '2')
    //   .style("opacity", 0.7)



    




    // configurePie
    // handleArcs
    // handleLegend


    /*
    this.setScales()
    this.callAxes()
    this.setColorScale()
    this.handleGridlines()
    this.handlePaths()
    this.handleAxisLabels()
    this.handleVertices()
    this.handleLegend()
    */
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