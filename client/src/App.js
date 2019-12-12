// modules
import React from 'react';
import {BrowserRouter as Router, Route } from 'react-router-dom'
// style
import './style/App.css';
// components
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './components/Home/Home';
import About from './components/About/About';
import PollList from './components/PollList/PollList';
import PollDetail from './components/PollDetail/PollDetail';
import Signin from './components/Signin/Signin';
import NewPoll from './components/NewPoll/NewPoll';
// server communication
import {getPollList, userSignup, userLogin, userLogout} from './lib/client';
import {updatePollList, addNewPoll, removePollById} from './lib/helper';

const basePath = "https://jia-fcc-votingapp.herokuapp.com/";

class App extends React.Component {
	state = {
		signinOpen: false,
		newPollOpen: false,
		pollList: [],
		user: {},
		token: ''
	}
	componentDidMount(){
		this.loadPollList();
		this.setState({
			user: JSON.parse(localStorage.user || "{}"),
			token: localStorage.token || ""
		});
		// this.updatePollList = setInterval(this.loadPollList, 10000);
	}
	componentWillUnmount(){
		// clearInterval(this.updatePollList);
	}
	loadPollList = () => getPollList(pollList => this.setState({pollList}))
	userSignup = (data) => {
		userSignup(data, res => {
			if(res.message === "Sign Up Successfully!"){
				userLogin(data, resData => this.userLogin(resData));
			}
		});
	}
	userLogin = (resData) => {	
		this.setState({
			user: resData.user,
			token: resData.token
		});
		localStorage.user = JSON.stringify(resData.user);
		localStorage.token = resData.token;
	}
	userLogout = () => {
		userLogout(res => {
			if(res.message === "Logout Successfully!"){
				this.setState({user: {}, token: ''});
				localStorage.user = "{}";
				localStorage.token = "";
			}
		})
	}
	updateDataForNewVote = (updatedPoll, updatedUser) => {
		let updatedPollList = updatePollList(updatedPoll, this.state.pollList);
		this.setState({pollList: updatedPollList, user: updatedUser});
		localStorage.user = JSON.stringify(updatedUser);
	} 
	updateDataForNewPoll = (newPoll, updatedUser) => {
		let updatedPollList = addNewPoll(newPoll, this.state.pollList);
		this.setState({pollList: updatedPollList, user: updatedUser});
		localStorage.user = JSON.stringify(updatedUser);
	}
	updateDataForDeletePoll = (pollId, updatedUser) => {
		let updatedPollList = removePollById(pollId, this.state.pollList);
		this.setState({pollList: updatedPollList, user: updatedUser});
		localStorage.user = JSON.stringify(updatedUser);
	}
	openSignin = () => this.setState({signinOpen: true})
	closeSignin = () => this.setState({signinOpen: false})
	openNewPoll = () => this.setState({newPollOpen: true})
	closeNewPoll = () => this.setState({newPollOpen: false})
	render() {
		return (
		    <Router>
		    	<div className={this.state.divide ? "app-root divide" : "app-root"}>
		    		<Header openSignin={this.openSignin} openNewPoll={this.openNewPoll} 
		    			token={this.state.token} userLogout={this.userLogout}
		    		/>

		    		<Route exact path="/" render={() => <Home openSignin={this.openSignin} />} />
		    		<Route path="/about" component={About} />
		    		<Route path="/list" render={() => (
		    			<PollList 
		    				pollList={this.state.pollList} 
		    				user={this.state.user}
		    				token={this.state.token} 
		    				updateDataForNewVote={this.updateDataForNewVote}
		    			/>
		    		)} />
		    		<Route path="/mypoll" render={() => {
		    			let username = this.state.user.username;
		    			if(!username) return null;
		    			let pollList = this.state.pollList.filter(poll => poll.author === username);
		    			return <PollList 
		    				pollList={pollList} 
		    				user={this.state.user} 
		    				token={this.state.token} 
		    				deletable={true}
		    				updateDataForDeletePoll={this.updateDataForDeletePoll}
		    			/>
		    		}} />

		    		<Route path="/poll:pollId" render={({match}) => {
		    			let pollId = match.params.pollId;
		    			let pollData = this.state.pollList.find(poll => poll._id === pollId);
		    			return <PollDetail pollData={pollData} user={this.state.user} basePath={basePath} />
		    		}} />

		    		<Signin open={this.state.signinOpen} closeSignin={this.closeSignin} 
		    			userSignup={this.userSignup} userLogin={this.userLogin}
		    		/>
		    		<NewPoll 
		    			pollList={this.state.pollList} user={this.state.user} token={this.state.token}
		    			updateDataForNewPoll={this.updateDataForNewPoll}
		    			open={this.state.newPollOpen} closeNewPoll={this.closeNewPoll} />
		    		<Footer />
		    	</div>
		    </Router>
		);
	}
}

export default App;
