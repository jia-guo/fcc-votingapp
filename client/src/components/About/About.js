import React from 'react';
import Paper from 'material-ui/Paper';
import './About.css';

const paperStyle = {
	project: {
	    height: 120, width: 120, margin: 20,
	    background: "url(./images/logo.png) 50% 50% no-repeat",
	    backgroundSize: 90 
	},
	author: {
		height: 120, width: 120, margin: 20,
	    background: "url(./images/author.jpg) 50% 50% no-repeat",
	    backgroundSize: 150
	}
};

const About = () => (
	<div className="about divide left-right-wrapper">
		<div className="about-left left">
			<h3 className="text-title-4">Project</h3>
			<Paper className="about-picture"
				style={paperStyle.project} zDepth={2} circle={true} />
			<ul className="about-list-wrapper">
				<li className="about-list-item">
					A freeCodeCamp full-stack project, following the instruction of 
					<a href="https://www.freecodecamp.com/challenges/build-a-voting-app"> "Basejump: Build a Voting App | Free Code Camp"</a>. 
				</li>
				<li className="about-list-item">Using a tech stack of React + Node.js + Express + MongoDB.</li>
				<li className="about-list-item">Other key framework/packages used including Material-ui, React Router(v4), Mongoose.</li>
				<li className="about-list-item">Acknowledgement to abeldb for the hand-shaped icon, retrieved from the noun project.</li>
			</ul>
		</div>
		<div className="about-right right">
			<h3 className="text-title-4">Author</h3>
			<Paper className="about-picture"
				style={paperStyle.author} zDepth={2} circle={true} />
			<ul className="about-list-wrapper">
				<li className="about-list-item author">Jia Guo</li>
				<div className="author-social-media">
	                <a className="fa fa-github" href="https://github.com/antipasjiajia"></a>
	                <a className="fa fa-linkedin-square" href="https://www.linkedin.com/in/jia-guo-40921642/?trk=nav_responsive_tab_profile_pic"></a>
	                <a className="fa fa-codepen" href="https://codepen.io/antipasjiajia/"></a>
	                <a className="fa fa-free-code-camp" href="https://www.freecodecamp.com/antipasjiajia"></a>
				</div>
				<li className="about-list-item"><i className="fa fa-map-marker"></i> Palo Alto, CA</li>
				<li className="about-list-item"><a href="https://antipasjiajia.github.io/">https://antipasjiajia.github.io/</a></li>
			</ul>
		</div>
		<div className="background-poll2" style={{backgroundImage: "url(./images/poll2.jpg)"}}/>
	</div>
)

export default About