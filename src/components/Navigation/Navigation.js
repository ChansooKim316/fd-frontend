import React from 'react';

const Navigation = ({ onRouteChange, isSignedIn }) => {
		if (isSignedIn) {
			return (
				<nav style={{display:'flex', justifyContent:'flex-end'}}>
					{/* if you click 'Sign Out', it'll move to 'Sign In'. */}
					<p onClick={() => onRouteChange('signout')} className='f3 link dim black underline pa3 pointer'>Sign Out</p>
				</nav>
			)
		} else {
			return (
				<nav style={{display:'flex', justifyContent:'flex-end'}}>
					{/* if you click 'Sign In', it'll move to 'signin' . Click 'Register', it'll move to 'register' */}
					<p onClick={() => onRouteChange('signin')} className='f3 link dim black underline pa3 pointer'>Sign In</p>
					<p onClick={() => onRouteChange('register')} className='f3 link dim black underline pa3 pointer'>Register</p>
				</nav>
			);
		}	
} 

export default Navigation;