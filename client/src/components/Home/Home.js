import React from 'react';
import {Link} from 'react-router-dom';
import RaisedButton from 'material-ui/RaisedButton';
import './Home.css';

const Home = (props) => (
	<div className="container">
		<div className="hero">
			<h1 className="text-title-1">
				<span>Poll simple. </span>
				<span>Poll everywhere. </span>
			</h1>
			<div className="hero-desc">
				<p className="text-title-5">Ask a question, then watch <em>LIVE</em> result.</p>
				<p className="text-title-5">Create public or private polls, <em>free</em>, <em>unlimited</em>, <em>always</em>.</p>
			</div>
			<RaisedButton className="hero-btn" label="Get Started >>" primary={true} 
				onTouchTap={props.openSignin}/>
			<Link to="/list">
				<RaisedButton className="hero-btn" label="View Poll List" />
			</Link>
			
		</div>
		<div className="background-poll1" style={{backgroundImage: "url(./images/poll1.jpg)"}}/>
	</div>
)

export default Home;