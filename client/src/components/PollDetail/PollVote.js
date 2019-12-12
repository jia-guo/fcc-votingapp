import React from 'react';
import { Link } from 'react-router-dom';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {vote} from '../../lib/client';
import {updateUser, updatePoll} from '../../lib/helper';
import './PollVote.css';

export default class PollVote extends React.Component {
	state = {
		pollVoteOpen: false,
		optionSelected: {}
	}
	componentWillReceiveProps = (nextProps) => {
		this.setState({
			pollVoteOpen: nextProps.pollVoteOpen
		});
	}
	handleOpen = () => this.setState({pollVoteOpen: true})
	handleClose = () => {
		this.setState({pollVoteOpen: false});
		this.props.closePollVote();
	}
	handleSelect = (e, i, value) => this.setState({optionSelected: {optionId: i, value}})
	handleVote = () => {
		if((this.state.optionSelected.optionId !== undefined) && this.props.user._id) {
			let options = this.props.pollVoteData.options;
			options.forEach(option => {
				if(option.optionId === this.state.optionSelected.optionId){
					option.vote += 1;
				}
			});
			let voteNum = this.props.pollVoteData.voteNum + 1;
			let voteData = {
				userId: this.props.user._id,
				token: this.props.token,
				options,
				voteNum
			};
			vote(this.props.pollVoteData._id, voteData);
			this.props.updateDataForNewVote(
				updatePoll(this.props.pollVoteData, {options, voteNum}), 
				updateUser('pollVoted', this.props.pollVoteData._id, this.props.user)
			);
		}
		this.handleClose();
	}
	render() {
	    let pollVoteData = this.props.pollVoteData;
		let isLogin = !!this.props.token;
		let loginReminder = isLogin ? "Vote and view poll result" : "Please login to vote";
		let actionLabel = isLogin ? "Vote and see result >>" : "See poll result >>";
		let optionMsg = isLogin ? "I'd like to vote for" : "Please login in to vote for"
		const actions = [
			<RaisedButton className="poll-vote-btn" label="<< Back to list" style={{float: 'left'}} onTouchTap={this.handleClose}/>,
			<Link to={'/poll' + this.props.pollVoteData._id} >
			 	<RaisedButton className="poll-vote-btn" label={actionLabel} primary={true}  onTouchTap={this.handleVote}/>
	 		</Link>
	    ];
	    return (
	      <div>
	        <Dialog
	          title={loginReminder}
	          actions={actions}
	          actionsContainerStyle={{padding: "0px 25px 40px 25px"}}
	          modal={false}
	          open={this.state.pollVoteOpen}
	          onRequestClose={this.handleClose}
	        >
	          <h3 className="text-title-3">Question</h3>
	          <p className="poll-question">{pollVoteData.topic}</p>
	          <div className="poll-vote-wrapper">
	          	  <p className="text-title-5">{optionMsg}</p>
		          <SelectField className="poll-vote-option"
			          floatingLabelText="Choose an option..."
			          value={this.state.optionSelected.value}
			          onChange={this.handleSelect}
			      >
			      	{pollVoteData.options && pollVoteData.options.map(option => 
		      			<MenuItem key={option.optionId} value={option.option} primaryText={option.option} />
			      	)}
			      </SelectField>
	          </div>
	        </Dialog>
	      </div>
	    );
	}
}
