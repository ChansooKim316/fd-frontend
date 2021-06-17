import React from 'react';
import './ImageLinkForm.css';
// import initialState from '../../App.js';

																				// and initialState.
const ImageLinkForm = ({ onInputChange, onButtonSubmit}) => {
/*  instead of doing 'props.onInputChange' here, we just destructur it from the 'props'  */
	const defaultURL = 'https://i.dailymail.co.uk/1s/2019/09/24/14/18871730-0-image-a-28_1569333047536.jpg'
	return (
		<div>
			<p className='f3'> 
				{'This Magic Brain will detect faces in your pictures. Git it a try'}
			</p>
			<div className='center'>   {/* f4 = size of 4 , pa2 = padding of 2 , w-70 = width of 70% */}
				<div className='form center pa4 br3 shadow-5'>																														{/* ㄴ> 70% of total width of the page */}
					<input className='f4 pa2 w-70' type='text' defaultValue={defaultURL} 
								onChange={onInputChange}
								placeholder="Paste image URL here" 
								id="imageInput" />    {/*******  8.24 change : added id="imageInput"  ******/}
					<button 
						id="detect-btn"  	/***** 8.24 change : added id="detect-btn" *****/
						/* grow = grow when you hoover , link = there will be a link. bg-light = background light */
						className='w-30 grow f4 link ph3 pv2 dib white bg-light-purple'
						onClick={onButtonSubmit}
					>Detect</button>
			  </div>
			</div>
		</div>
	);
}

export default ImageLinkForm;