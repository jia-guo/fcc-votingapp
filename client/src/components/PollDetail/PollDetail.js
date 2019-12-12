import React from 'react';
import * as d3 from "d3";
import { Link } from 'react-router-dom';
import RaisedButton from 'material-ui/RaisedButton';
import './PollDetail.css';

export default class PollDetail extends React.Component {
	componentDidMount(){
		this.renderChart();
		window.addEventListener('resize', this.renderChart);
	}
	componentWillReceiveProps(nextProps){
		if(nextProps.pollData)
			this.renderChart();
	}
	componentWillUnmount(){
		window.removeEventListener('resize', this.renderChart);
	}
	parseTime = (timeStr) => {
		let timeObj = new Date(timeStr);
		return `${timeObj.getUTCFullYear()}/${timeObj.getMonth() + 1}/${timeObj.getDate()}`;
	}
	renderChart = () => {
		if(!this.props.pollData) return;
		let chart = d3.select('#chart');
		let data = this.props.pollData.options;
		let width = chart.node().clientWidth;
		let xScale = d3.scaleLinear()
			.domain([0, d3.max(data, d => d.vote)])
			.range([0, width]);
		chart.selectAll('.bar').remove();
		let bars = chart
			.selectAll('.bar')
			.data(data)
			.enter()
			.append('div')
			.attr('class', 'bar');
		bars.append('div').attr('class', 'label').text(d => d.option);
		bars.append('div').attr('class', 'vote').text(d => d.vote);
		bars
		    .style('top', (d, i) => i * 50 + 30 + 'px')
		    .style('height', '20px')
		    .style('width', '0px')
		    .transition()
		    .delay(500)
		    .duration(1000)
		    .style('width', d => xScale(d.vote) + 'px');
	}
	render(){
		let pollData = this.props.pollData;
		if(pollData){
			return (
				<div className="container poll-detail">
		        	<div className="poll-detail-info">
						<h1 className="text-title-2">
							{pollData.topic}
							<i className="fa fa-question"></i>
						</h1>
						<div className="poll-detail-info-desc">
							<p className="text-title-5">Created by {pollData.author} on {this.parseTime(pollData.postTime)}</p>
							<p className="text-title-5">Total vote: {pollData.voteNum}</p>
						</div>
						<Link to="/list">
							<RaisedButton className="poll-detail-info-btn" label="<< Back to list" />
						</Link>
						<a href={`https://twitter.com/intent/tweet?hashtags=2poll&text=View this poll at ${this.props.basePath}poll${pollData._id}`} 
							target="_blank" >
							<RaisedButton className="poll-detail-info-btn" label="Share on Twitter" primary={true} 
								icon={<i className="fa fa-twitter" />} />
						</a>
					</div>
					<div className="poll-detail-chart" id="chart" ref="chart"></div>
					<div className="background-poll1" style={{backgroundImage: "url(./images/poll1.jpg)"}}/>
				</div>
			)
		} else {
			return null;
		}		
	}
}
