import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { Subject } from 'rxjs';
import { BarChartData } from 'src/app/model/IBarChart';

@Component({
	selector: 'app-bar',
	templateUrl: './bar.component.html',
	styleUrls: ['./bar.component.scss']
})
export class BarComponent implements OnInit {

	private _data: BarChartData[] = [];
	@ViewChild('chart', { static: true }) chart: ElementRef;

	constructor() { }

	ngOnInit(): void {
		this._clearChart();
		this.chartWidth = this.chart.nativeElement.getBoundingClientRect().width;
	}

	ngAfterViewInit() {
		// this.chartWidth = this.chart.nativeElement.width;
	}

	private _clearChart() {
		d3
		.select(this.chart.nativeElement)
		.select(".barchart")
		.select("*")
		.remove();
  	}

	chartWidth = 1500;
	chartHeight = 200;
	highestScore = 1;
	yDomainMax = this.highestScore;

  @Input() public set data(data: BarChartData[]) {
		this._data = data;

		const yDomain: number[] = this._data.map(data => data.value);
		console.log(yDomain);
		this.highestScore = Math.max(...yDomain);
		this.yDomainMax = this.highestScore;

		const container = d3
			.select('.bar-chart');

		const bars = container
			.selectAll('.bar')
			.data(this._data)
			.enter()
			.append('rect')
			.classed('bar', true)
			.text(data => data.title)
			.attr('width', this.xScale().bandwidth())
			.attr('height', (data) => this.chartHeight - this.yScale()(data.value))
			.attr('x', data => this.xScale()(data.title))
			.attr('y', data => this.yScale()(data.value));
	}
  
  private xScale = () => {
  	return d3
  		.scaleBand()
  		.domain(this._data.map((dataPoint) => dataPoint.title))
  		.rangeRound([0, this.chartWidth])
  		.padding(0.2);
  };

  private yScale = () => {
  	return d3
  		.scaleLinear()
  		.domain([0, this.yDomainMax])
  		.range([this.chartHeight, 0]);
  };
}
