import React from 'react';
import {PopupboxManager, PopupboxContainer} from 'react-popupbox';
import "react-popupbox/dist/react-popupbox.css"
import "./Signin.css"

class Signin extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			signInEmail: '',
			signInPassword: '',
			alertExecuted: false
		}
	}
	

	onEmailChange = (event) => {
		this.setState({signInEmail: event.target.value})
		this.enterKeyListener()  //// 9.10 modified
	}
	
	onPasswordChange = (event) => {
		this.setState({signInPassword: event.target.value})
		this.enterKeyListener()  //// 9.10 modified
	}

	saveAuthTokenInSession = (token) => {
		window.sessionStorage.setItem('token', token);
		// window.localStorage.setItem('token', token);
	}

	onSubmitSignIn = () => {
		// Loading message
		this.openPopupbox()
		fetch('http://localhost:80/signin', {
			method: 'post',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				email: this.state.signInEmail,
				password: this.state.signInPassword
			})
		}) 
			.then(response => response.json())
			.then(data => {
				if (data.userId && data.success === 'true') {
					this.saveAuthTokenInSession(data.token);
					fetch(`http://localhost:80/profile/${data.userId}`, {
						method: 'get',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': data.token
						}
						})
						.then(resp => resp.json())
						.then(user => {
							if (user && user.email) {
								this.props.loadUser(user);
								this.props.onRouteChange('home');
							}
						})
          .catch(console.log)
				}
			})
			.catch(err => console.log(err))
	}

	//// 9.10 modified : Key listener for enter-key press
	enterKeyListener = () => {
		// listening email input
		document.getElementById('email-address').addEventListener('keypress', function (e) {
		if (e.key === 'Enter') {
			document.getElementById("signin-btn").click();
			}
		});
		// listening password input
		document.getElementById('password').addEventListener('keypress', function (e) {
		if (e.key === 'Enter') {
			document.getElementById("signin-btn").click();
			}
		});
	}

	openPopupbox() {
		const content = (
						<div>
						<h3>Loading...</h3>
						<p>(The first login may take 20 seconds)</p>
						</div>
						)
		PopupboxManager.open({
		content,
		config: {
			titleBar: {
			enable: false,
			text: ''
			},
			fadeIn: true,
			fadeInSpeed: 200
		}
		})
	}

	render() {
		const { onRouteChange } = this.props;
		return (
			<article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
				<PopupboxContainer/> 
				<main className="pa4 black-80">
				  <div className="measure"> {/* removed 'center' , cuz we have center in article tag */}
				    <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
				      <legend className="f1 fw6 ph0 mh0">Sign In</legend>
				      <div className="mt3">
				        <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
				        <input 
				        	className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100 hover-black" 
				        	type="email" 
				        	name="email-address"  
				        	id="email-address" 
				        	onChange = {this.onEmailChange}
			        	/>
				      </div>
				      <div className="mv3">
				        <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
				        <input 
				        	className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100 hover-black" 
				        	type="password" 
				        	name="password"  
				        	id="password" 
				        	onChange = {this.onPasswordChange}
				       	/>
				      </div>
				    </fieldset>
				    <div className="">
				      <input 
					      onClick={this.onSubmitSignIn} 
					      className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
					      type="submit" 
					      value="Sign in"
					      id="signin-btn"     //// 9.10 modified 
					    />
				    </div>
				    <div className="lh-copy mt3">																		{/* 'pointer' changes cursor shape */}
				      <p onClick={() => onRouteChange('register')} className="f6 link dim black db pointer">Register</p> 
				    </div>
				  </div>
				</main>
			</article>
		);
	}
}

export default Signin;