import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import RadioBtn from 'material-ui/svg-icons/toggle/radio-button-checked';
import Close from 'material-ui/svg-icons/content/clear';
import {postNewPoll} from '../../lib/client';
import {checkOptions, formatOptions, updateUser} from '../../lib/helper';
import './NewPoll.css';

export default class NewPoll extends React.Component {
	state = {
		open: false,
		question: '',
		questionErrorText: '',
		options: ['', '']
	}
	componentWillReceiveProps(nextProps){
		this.setState({open: nextProps.open});
	}
	handleClose = () => {
		this.setState({
			open: false, 
			question: '',
			questionErrorText: '',
			options: ['', '']
		});
		this.props.closeNewPoll();
	}
	handleOpen = () => this.setState({open: true})
	updateQuestion = (e) => {
		this.setState({question: e.target.value})
		if(e.target.value !== '')
			this.setState({questionErrorText: ''})
	}
	handleQuestionBlur = () => {
		if(this.state.question === ''){
			this.setState({questionErrorText: 'This field is required'})
		} else if(this.props.pollList.filter(poll => poll.topic === this.state.question).length) {
			this.setState({questionErrorText: 'A poll with the same question already exists'})
		}
	}
	addOption = () => {
		let stateOptions = this.state.options;
		let options = [...stateOptions, ''];
		this.setState({options});
	}
	removeOption = (i) => {
		let stateOptions = this.state.options;
		let options = [...stateOptions.slice(0, i), ...stateOptions.slice(i+1)];
		this.setState({options});
	}
	updateOption = (i, e) => {
		let stateOptions = this.state.options;
		let options = [...stateOptions.slice(0, i), e.target.value, ...stateOptions.slice(i+1)];
		this.setState({options});
	}
	renderOptions = () => {
		let options = this.state.options;
		return options.map((option, i) => 
			<div className="newpoll-option-wrapper" key={i}>
		    	<RadioBtn style={{fill: '#FF9800'}} />
		    	<TextField className="newpoll-option-input" 
		    		hintText={option === '' ? 'Option'+(i+1) : option} 
		    		value={this.state.options[i]} onChange={this.updateOption.bind(null, i)} />
			    <Close style={{fill: '#BDBDBD'}} onTouchTap={this.removeOption.bind(null, i)} />
		    </div>)
	}
	submitNewPoll = () => {
		this.handleClose();
		if(!this.state.question || this.state.questionErrorText) return;
		if(!checkOptions(this.state.options)) return;
		let {user} = this.props;
		let newPollData = {
			author: user.username,
			userId: user._id,
			token: this.props.token,
			pollCreated: user.pollCreated,
			topic: this.state.question,
			options: formatOptions(this.state.options)
		};
		postNewPoll(newPollData, res => {
			let newPoll = res.poll;
			let updatedUser = updateUser('pollCreated', newPoll._id, this.props.user);
			this.props.updateDataForNewPoll(newPoll, updatedUser);
		});
	}
	render(){
		const actions = [
	      <FlatButton
	        label="CLOSE"
	        onTouchTap={this.handleClose}
	        style={{color: '#9E9E9E'}}
	      />,
	      <FlatButton
	        label="SUBMIT"
	        primary={true}
	        keyboardFocused={true}
	        onTouchTap={this.submitNewPoll}
	      />,
	    ];
	    return (
	      <div>
	        <Dialog className="newpoll-dialog"
	          title="New Poll"
	          actions={actions}
	          actionsContainerStyle={{padding: '0 30px 20px 30px'}}
	          modal={false}
	          open={this.state.open}
	          onRequestClose={this.handleClose}
	          autoScrollBodyContent={true}
	        >
	        	<TextField className="newpoll-question"
			        hintText="Question"
			        floatingLabelText="Question"
			        errorText={this.state.questionErrorText}
			        value={this.state.question}
			        onChange={this.updateQuestion}
			        onBlur={this.handleQuestionBlur}
			    />
			    {this.renderOptions()}
			    <FlatButton
			        label="Add more Option"
			        primary={true}
			        style={{float: 'right'}}
			        onTouchTap={this.addOption}
			    />
	        </Dialog>
	      </div>
	    );
	}
}