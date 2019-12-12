import React from 'react';
import { Link } from 'react-router-dom'
import './Header.css';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui/svg-icons/navigation/menu';
import ExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import Divider from 'material-ui/Divider';

const drawerContainerStyle = {
	textAlign: "center", 
	paddingTop: "80px",
	backgroundColor: "#FCFCFC",
	backgroundImage: "url(./images/poll2.jpg)",
	backgroundPosition: "0% 100%",
    backgroundRepeat: "no-repeat"
}

class Header extends React.Component{
	state = {
		sidebarOpen: false,
		menuOpen: false,
		login: !!this.props.token
	}
	componentWillReceiveProps(nextProps){
		this.setState({login: !!nextProps.token})
	}
	handleSidebarToggle = () => this.setState({sidebarOpen: !this.state.sidebarOpen})
	handleSidebarClose = () => this.setState({sidebarOpen: false})
	handleMenuOpen = e => {
	    e.preventDefault();
	    this.setState({menuOpen: true, anchorEl: e.currentTarget})
	}
	handleMenuClose = () => this.setState({menuOpen: false})
	handleLogout = () => {
		this.setState({login: false});
		this.props.userLogout();
	}
	render(){
		return (
		  <header className="header">
		  	<Link className="header-logo" to="/">
		  		<img className="header-logo-img" src="./images/logo.png" alt="2poll logo" />
		  		<h1 className="header-logo-title">2POLL</h1>
		  	</Link>
		  	<nav className="header-nav">
		  		<Link className="header-nav-about" to="/about">About</Link>
				<Link className="header-nav-polllist" to="/list">Poll list</Link>
				{
					this.state.login ?
						<Link to="#" className="header-nav-user" onTouchTap={this.handleMenuOpen}>
							Welcome <ExpandMoreIcon />
							<Popover
					          open={this.state.menuOpen}
					          anchorEl={this.state.anchorEl}
					          anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
					          targetOrigin={{horizontal: 'right', vertical: 'top'}}
					          onRequestClose={this.handleMenuClose}
					        >
					          <Menu>
					             <MenuItem onTouchTap={() => {this.props.openNewPoll(); this.handleMenuClose();}}>
					            	<Link className="header-nav-newpoll" to="#">
					            		Create New
					            	</Link>
					            </MenuItem>
					            <MenuItem onTouchTap={this.handleMenuClose}>
				            		<Link className="header-nav-mypolls" to="/mypoll" >
				            			View My Polls
				            		</Link>
				            	</MenuItem>
					            <Divider />
					            <MenuItem onTouchTap={() => {this.handleLogout(); this.handleMenuClose();}}>
					            	<Link className="header-nav-logout" to="#">
					            		Logout
					            	</Link>
					            </MenuItem>
					          </Menu>
					        </Popover>
						</Link>
						:
						<Link className="header-nav-signin" to="#" onTouchTap={this.props.openSignin}>Sign in</Link>
				}
		  	</nav>
		  	<div className="header-nav-sm">
		  		<IconButton>
		  			<MenuIcon onTouchTap={this.handleSidebarToggle} />
		  		</IconButton>
		        <Drawer 
		        	className="header-nav-side"
		        	width={200} docked={false} openSecondary={true}
		        	open={this.state.sidebarOpen} 
		        	onRequestChange={(sidebarOpen) => this.setState({sidebarOpen})}
		        	containerStyle={drawerContainerStyle}
				>
		            <MenuItem onTouchTap={this.handleSidebarClose}> 
		          	    <Link to="/about">About</Link>
	          	    </MenuItem>
		            <MenuItem onTouchTap={this.handleSidebarClose}>
		          	    <Link to="/list">Poll list</Link>
	          	    </MenuItem>
	          	    {
	          	    	this.state.login ?
		          	    	<div>
			          	    	<MenuItem onTouchTap={this.handleSidebarClose}>
					          	    <Link to="#" onTouchTap={this.props.openNewPoll}>Create New</Link>
				          	    </MenuItem> 
				          	    <MenuItem onTouchTap={this.handleSidebarClose}>
					          	    <Link to="/mypoll" >My Polls</Link>
				          	    </MenuItem> 
				          	    <MenuItem onTouchTap={this.handleSidebarClose}>
					          	    <Link to="#" onTouchTap={this.handleLogout}>Logout</Link>
				          	    </MenuItem>
			          	    </div> :
		          	    	<MenuItem onTouchTap={this.handleSidebarClose}>
					        	<Link to="#" onTouchTap={this.props.openSignin}>Sign in</Link>
					    	</MenuItem>
	          	    }
		        </Drawer>
		      </div>
		  </header>
		)
	}
};

export default Header;