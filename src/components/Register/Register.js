import React from 'react';
//// 9.16 modefied : import pop-up box
import {PopupboxManager, PopupboxContainer} from 'react-popupbox';
import "react-popupbox/dist/react-popupbox.css"


class Register extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: '',
			name: ''
		}
	}

	onNameChange = (event) => {
		this.setState({name: event.target.value})
		this.enterKeyListener()  //// 9.10 modified
	}

	onEmailChange = (event) => {
		this.setState({email: event.target.value})
		this.enterKeyListener()  //// 9.10 modified
	}

	onPasswordChange = (event) => {
		this.setState({password: event.target.value})
		this.enterKeyListener()  //// 9.10 modified
	}

	onSubmitSignIn = () => {
		
		fetch('https://localhost:80/register', {
			method: 'post', // default is 'get' request.
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				email: this.state.email,
				password: this.state.password,
				name: this.state.name
			})
		}) 
			.then(response => response.json())
			.then(user => {
				if (user.id) {
					this.props.loadUser(user)
					this.props.onRouteChange('home');
				}
			})
	// loading message
	this.openPopupbox()   //// 9.16 modified
	}

	//// 9.10 modified : Key listener for enter-key press
  enterKeyListener = () => {
  	// listening name input
    document.getElementById('name').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        document.getElementById("register-btn").click();
        }
    });
    // listening email input
    document.getElementById('email-address').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        document.getElementById("register-btn").click();
        }
    });
    // listening password input
    document.getElementById('password').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        document.getElementById("register-btn").click();
        }
    });
  }

  //// 9.16 modified : pop-up box for loading message
  // document : https://fraina.github.io/react-popupbox/
  openPopupbox() {
      const content = (
                      <div>
                        <h3>Loading...</h3>
                        <p>(The first register may take 20 seconds)</p>
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
		return (
			<article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
				<PopupboxContainer/>  {/* 9.16 modified */}
				<main className="pa4 black-80">
				  <div className="measure"> {/* removed 'center' , cuz we have center in article tag */}
				    <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
				      <legend className="f1 fw6 ph0 mh0">Register</legend>
				      <div className="mt3">
				        <label className="db fw6 lh-copy f6" htmlFor="name">Name</label>
				        <input 
				        	className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
				        	type="text" 
				        	name="name"  
				        	id="name" 
				        	onChange={this.onNameChange}
				        />
				      </div>
				      <div className="mt3">
				        <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
				        <input 
				        	className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
				        	type="email" 
				        	name="email-address"  
				        	id="email-address" 
				        	onChange={this.onEmailChange}
				        />
				      </div>
				      <div className="mv3">
				        <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
				        <input 
				        	className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
				        	type="password" 
				        	name="password"  
				        	id="password" 
				        	onChange={this.onPasswordChange}
				        />
				      </div>
				    </fieldset>
				    <div className="">
				      <input
				      	//   id="registerBtn" 
					      onClick={this.onSubmitSignIn} 
					      className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
					      type="submit" 
					      value="Register"
					      id="register-btn"     //// 9.10 modified 
					    />
				    </div>
				  </div>
				</main>
			</article>
		);
	}
}

export default Register;