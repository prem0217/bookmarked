import React, { Component } from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import { Route, BrowserRouter, Link, Redirect, Switch } from 'react-router-dom'

import Register from './Register'
import Home from './Home'
import Feed from './protected/Feed'
import UserProfile from './UserProfile'
import EditUserProfile from './protected/EditUserProfile'
import AddBookmark from './AddBookmark'
import { logout } from '../helpers/auth'
import { firebaseAuth } from '../config/constants'
import Dropdown, { DropdownTrigger, DropdownContent } from '../../node_modules/react-simple-dropdown/lib/components/Dropdown.js';
import icon from '../Images/icon.svg';
import addIcon from '../Images/addIcon.svg';

function PrivateRoute ({component: Component, authed, ...rest}) {
  return (
	<Route
	  {...rest}
	  render={(props) => authed === true
		? <Component {...props} />
		: <Redirect to={{pathname: '/home', state: {from: props.location}}} />}
	/>
  )
}

function PublicRoute ({component: Component, authed, ...rest}) {
  return (
	<Route
	  {...rest}
	  render={(props) => authed === false
		? <Component {...props} />
		: <Redirect to='/feed' />}
	/>
  )
}

export default class App extends Component {
  state = {
	authed: false,
	loading: true,
  }
  componentDidMount () {
	this.removeListener = firebaseAuth().onAuthStateChanged((user) => {
	  if (user) {
		this.setState({
		  authed: true,
		  loading: false,
		})
	  } else {
		this.setState({
		  loading: false
		})
	  }
	})
  }
  componentWillUnmount () {
	this.removeListener()
  }

  render() {
	return this.state.loading === true ? <h1>Loading</h1> : (
	  <BrowserRouter>
		<div>
		  <nav className="navbar navbar-default navbar-fixed-top">
			<div className="container">
			  <div className="navbar-header">
				<Link to="/" className="navbar-brand"><img src="https://firebasestorage.googleapis.com/v0/b/bookmarked-d5236.appspot.com/o/logo.png?alt=media&token=3ce527c6-bc81-439b-b60e-a4767315ff5c" className="logoIMG" width="150vw" height="150vw" alt="Home"/></Link>
			  </div>
				<div className="user-control">
				  {this.state.authed
					?<Dropdown className="account-menu" ref="dropdown">
              <img className="add-icon" width="34" height="34" src={addIcon} alt="Add Icon"/>
						  <DropdownTrigger>
							<img className="account-icon" width="60" height="60" src={icon} alt=" "/>
						  </DropdownTrigger>
						   <DropdownContent className="dropdowncont">
							   <Link to="/feed" className="dropdowntext"><p>Feed</p></Link>
                 <Link to="/add" className="dropdowntext"><p>Add Test</p></Link>
							   <Link to="/userprofile" className="dropdowntext"><p>User Profile</p></Link>
							   <Link to="/edituserprofile" className="dropdowntext"><p>Edit Profile</p></Link>
							  <button
							  style={{border:'none', float:'right', width:'80px', background: 'transparent'}}
							  onClick={() => {
								logout()
								this.setState({authed: false})
							  }}
							  className="dropdowntext">Logout</button>
					   </DropdownContent>
					   </Dropdown>
					: <span>
					  </span>}
			  </div>
			</div>
		  </nav>
		  <div className="container">
			<div className="row">
			  <Switch>
				<PublicRoute authed={this.state.authed} path='/home' component={Home} />
				<PublicRoute authed={this.state.authed} path='/register' component={Register} />
				<PrivateRoute authed={this.state.authed} path='/feed' component={Feed} />
        <PrivateRoute authed={this.state.authed} path='/add' component={AddBookmark} />
				<PrivateRoute authed={this.state.authed} path='/userprofile' component={UserProfile} />
				<PrivateRoute authed={this.state.authed} path='/edituserprofile' component={EditUserProfile} />
				<PublicRoute authed={this.state.authed} path='/' component={Home}/>
			  </Switch>
			</div>
		  </div>
		</div>
	  </BrowserRouter>
	);
  }
}
