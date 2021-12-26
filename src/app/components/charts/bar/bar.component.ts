import { Component, Input, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { BarChartData } from 'src/app/model/IBarChart';

@Component({
  selector: 'app-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.scss']
})
export class BarComponent implements OnInit {

  private _data: BarChartData[] = [];

  constructor() { }

  ngOnInit(): void {


  }

  @Input() public set data(data: BarChartData[]) {
    this._data = data;
    const container = d3
    .select('.bar-chart')

    const bars = container
    .selectAll('.bar')
    .data(this._data)
    .enter()
    .append('rect')
    .classed('bar', true)
    .text(data => data.title)
    .attr('width', this.xScale().bandwidth())
    .attr('height', (data) => 200 - this.yScale()(data.value))
    .attr('x', data => this.xScale()(data.title))
    .attr('y', data => this.yScale()(data.value));
  };
  
  private xScale = () => {
    return d3
      .scaleBand()
      .domain(this._data.map((dataPoint) => dataPoint.title))
      .rangeRound([0, 250])
      .padding(0.1);
  }

  private yScale = () => {
    return d3
    .scaleLinear()
    .domain([0, 15])
    .range([200, 0]);
  }
}
