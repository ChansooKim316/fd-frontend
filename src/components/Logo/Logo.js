import React from 'react';
import Tilt from 'react-tilt';
import brain from './brain.png' // assigned 'brain' as a default name for brain.png
import './Logo.css';


const Logo = () => {
	return (
		<div className='ma4 mt0'> {/* mt = margin top , ma = ?  */}
			<Tilt className="Tilt br2 shadow-2" options={{ max : 55 }} style={{ height: 150, width: 150 }} >
			 {/* br = border radius , pa3 = padding of 3  */}
				<div className="Tilt-inner pa3">
			 		<img style={{paddingTop: '5px'}} alt='logo' src={brain}/>
			 	</div>
			</Tilt>		
		</div>
	);
}

export default Logo;