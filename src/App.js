import React from 'react';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Modal from './components/Modal/Modal';
import Profile from './components/Profile/Profile';
import './App.css';


const particlesOptions = {
  particles: {
    number: {
      value: 35,
      density: {
        enable: true,
        value_area: 150
      }
    }
  },
  ///// 9.10 modified : disabled interactivity
  // "interactivity": {
  //   "detect_on": "window",
  //   "events": {
  //     "onhover": {
  //       "enable": true,
  //       "mode": "repulse"
  //     },
  //     "onclick": {
  //       "enable": true,
  //       "mode": "push"
  //     },
  //     "resize": true
  //   },
  //   "modes": {
  //     "grab": {
  //       "distance": 400,
  //       "line_linked": {
  //         "opacity": 1
  //       }
  //     },
  //     "bubble": {
  //       "distance": 400,
  //       "size": 40,
  //       "duration": 2,
  //       "opacity": 8,
  //       "speed": 3
  //     },
  //     "repulse": {
  //       "distance": 200,
  //       "duration": 0.4
  //     },
  //     "push": {
  //       "particles_nb": 2
  //     },
  //     "remove": {
  //       "particles_nb": 2
  //     }
  //   }
  // }
}

const defaultURL = 'https://i.dailymail.co.uk/1s/2019/09/24/14/18871730-0-image-a-28_1569333047536.jpg'

const initialState = {
  // 12.19 modified : set default image
  input: defaultURL,  // 'input' goes to 'onButtonSubmit' {imageUrl: input}
  imageUrl: '',
  boxes: [],  // box goes to <FaceRecognition /> component
  route: 'signin',
  isSignedIn: false,
  isProfileOpen: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0, // how many times he signed in
    joined: '', // create a date when this part gets executed.
    pet: '',
    age: ''
  }
}

// function App() 
class App extends React.Component{
  constructor() {
    super();
    this.state = initialState;
  }
 
  // Check if there's a token (It runs when the user refreshes)
  componentDidMount() {
    const token = window.sessionStorage.getItem('token');
    if (token) {
      fetch('http://localhost:80/signin', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      })
        // recieve 'id' from the back-end (getAuthTokenId())
        .then(resp => resp.json())
        .then(data => {
          if (data && data.id) {
            fetch(`http://localhost:80/profile/${data.id}`, {
              method: 'get',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': token
              }
            })
              .then(resp => resp.json())
              .then(user => {
                this.loadUser(user)
                this.onRouteChange('home')
              })
          }
        })
        .catch(console.log)
    }
  }

  // get data from 'Sign In' form
  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined,
      pet: data.pet,
      age: data.age
    }})
  }

  calculateFaceLocation = (data) => {
    if (data && data.outputs) {
      // recieves input from Clarifai
      const image = document.getElementById('inputimage');
      // grabbing 'inputimage' from FaceRecognition.js <img id='inputimage'  .../> 
      const width = Number(image.width);
      const height = Number(image.height); // to make sure width,height are number(not string)
      // console.log(width, height);
      return data.outputs[0].data.regions.map(face => {
        const clarifaiFace = face.region_info.bounding_box;
        return {
          leftCol: clarifaiFace.left_col * width,
          topRow: clarifaiFace.top_row * height,
          rightCol: width - (clarifaiFace.right_col * width),
          bottomRow: height - (clarifaiFace.bottom_row * height)
        }
      });
    }
    return
  }

  displayFaceBox = (boxes) => {
    if (boxes) {
      this.setState({boxes: boxes});
    }
  }


  onInputChange = (event) => {
    this.setState({input: event.target.value});
    this.enterKeyListener()  // 9.10 modified
  }

  onButtonSubmit = () => {
    // need to do < npm install clarifai > first
    this.setState({imageUrl: this.state.input}); // it passes 'imageUrl' to <FaceRecognition /> tag
      fetch('http://localhost:80/imageurl', {
        method: 'post', // default is 'get' request.
        headers: {
          'Content-Type': 'application/json',
          'Authorization': window.sessionStorage.getItem('token')
        },
        body: JSON.stringify({
          input: this.state.input
        })
      })
      .then(response => response.json()) // because this is a fetch, we have to do response.json()
      .then(response => {
        if (response) {
          fetch('http://localhost:80/image', {
            method: 'put', // default is 'get' request.
            headers: {
              'Content-Type': 'application/json',
              'Authorization': window.sessionStorage.getItem('token')
            },
            body: JSON.stringify({
              id: this.state.user.id 
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count}))
            })
        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(err => console.log(err));
  }

  // 'onRouteChange' changes states(line51) : isSignedIn, route
  onRouteChange = (route) => {
    if (route === 'signout') {
      return this.setState(initialState)
    } else if (route === 'home') {
      this.setState({isSignedIn: true})      
    }
    this.setState({route: route}); 
  }

  toggleModal = () => {
    // returning all state with the changed state
    this.setState(prevState => ({
      ...prevState,
      isProfileOpen: !prevState.isProfileOpen
    }))
  }

  enterKeyListener = () => {
    // listening enter key on url input
    document.getElementById('imageInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        document.getElementById("detect-btn").click();
        }
    });
  }  

  render() {
    const { isSignedIn, imageUrl, route, boxes, isProfileOpen, user } = this.state; // destructuring. write this line, and delete 'this.state'
    return (
      <div className="App">
        <Particles className='particles'
          params = {particlesOptions} 
        />
        {/* components : Navigation, Logo, Rank, ImageLinkForm, FaceRecognition, SiginIn, Register 
                    ㄴ>  imported from './components/.../     */}
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}
          toggleModal={this.toggleModal} />
        {/* isProfileOpen ? <Modal>..</Modal> : null */}
        { isProfileOpen &&
          <Modal>
            <Profile 
              isProfileOpen={isProfileOpen} 
              toggleModal={this.toggleModal}
              loadUser={this.loadUser}
              user={user}  
            />
          </Modal>
        }
        { route === 'home'
          ? <div> 
              <Logo /> 
              
              <Rank name={this.state.user.name} entries={this.state.user.entries}/> 
              <ImageLinkForm 
                onInputChange={this.onInputChange} 
                onButtonSubmit={this.onButtonSubmit}
              /> 
              <FaceRecognition boxes={boxes} imageUrl={imageUrl}/>
            </div> // don't return multiple elements, wrap them into one 
          : (
             route === 'signin'
             ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>  
             : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            )
        }
      </div>
    );
  }
}

export default App;
