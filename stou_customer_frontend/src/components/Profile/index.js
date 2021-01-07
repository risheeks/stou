import React, { Component } from "react";
import { Row, Col, Container, Button, FormGroup, FormControl, FormLabel, Image, ListGroup, Form } from "react-bootstrap";
import axios from 'axios';
import uploadimage from '../../constants/images/wineandcode.png';
import "../../styles/Main.css";
import imageCompression from 'browser-image-compression';
import firebase from "firebase";
import { serverURL } from "../../config/index.js"
import { firebaseConfig } from "../../config/index.js"
import { FaHeart, FaRegHeart } from "react-icons/fa";
import FavoriteFood from './FavoriteFood';
import Raven from 'raven-js';

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.updateProfile = this.updateProfile.bind(this);
    this.getProfile = this.getProfile.bind(this);
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
      firebase.analytics();
    }
    this.state = {
      name: '',
      email: '',
      role: 'CUSTOMER',
      //   cuisines: '',
      aboutMe: '',
      uploadedImage: '',
      progress: 0,
      avatarURL: '',
      fireBaseURL: '',
      pastfood: [],
      defaultURL: 'https://firebasestorage.googleapis.com/v0/b/stou-79b9a.appspot.com/o/4.png?alt=media&token=47d52479-c8cf-46a1-8116-e5f1bc8765f7'
    };
    // this.getProfile();

  }
  componentDidMount() {
    this.getProfile();
    this.getHomecooks();
  }
  handleChangeUsername = event =>
    this.setState({ username: event.target.value });

  componentDidUpdate(prevProps) {
    console.log(this.props.email);
    if (this.props.email && this.props.email != 'undefined' && this.props.email !== prevProps.email) {
      this.getProfile();
    }
  }

  handleChange = e => {
    this.setState({ [e.target.id]: e.target.value })
  }

  generateUniqueID(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  uploadToFireBase = e => {
    //let { fireBaseURL } = this.state;

    const self = this;
    let randomID = this.generateUniqueID(25);
    let url = '';
    let path = "images/" + randomID;
    let uploadTask = firebase.storage().ref().child(path).put(this.state.uploadedImage);
    uploadTask.on('state_changed', function (snapshot) {
      let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
          console.log('Upload is paused');
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          console.log('Upload is running');
          break;
      }
    }, function (error) {
      // Handle unsuccessful uploads
    }, function () {
      uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
        console.log('File available at', downloadURL);
        url = downloadURL;
        self.setState({ fireBaseURL: url }, () => self.updateProfileCallBack());
      });
    });

  }
  updateProfileCallBack = () => {

    let apiCall = serverURL;
    apiCall = apiCall + "/editProfile";
    console.log("photo URL=" + this.state.fireBaseURL);
    if (!this.state.aboutMe) this.state.aboutMe = " "
    axios.post(`${serverURL}/editProfile`, {
      data: {
        name: this.state.name,
        role: this.state.role,
        aboutMe: this.state.aboutMe,
        profilePicture: this.state.fireBaseURL,
        email: this.props.email,
      }
    })
      .then(res => {
        console.log(res.data);
      })
      .catch(err => {
        Raven.captureException("EditProfile: " + err);
      })
  }
  updateProfile = e => {
    if (!this.state.avatarURL) {
      this.setState({ fireBaseURL: this.state.defaultURL });
      this.updateProfileCallBack();
    } else if (this.state.avatarURL.toString().startsWith("https://firebasestorage.googleapis.co")) {
      this.setState({ fireBaseURL: this.state.avatarURL }, () => this.updateProfileCallBack());
    } else {
      this.uploadToFireBase();
    }
  }


  getProfile = e => {
    let apiCall = serverURL;
    apiCall = apiCall + "/profile";
    axios.post(`${serverURL}/profile`, {
      data: {
        email: this.props.email,
        role: 'Customer'
      }
    })
      .then(res => {
        if (res.data.name.length > 0) {
          this.setState({
            name: res.data.name,
            aboutMe: res.data.aboutMe,
            avatarURL: res.data.profilePicture,
            email: res.data.email
          });
          if (!this.state.avatarURL) {
            this.setState({ avatarURL: this.state.defaultURL });
          }
        }
      })
      .catch(err => {
        Raven.captureException("Profile: " + err);
      })


  }

  ChangeSaveFavHomeCookStatus = (e) => {
    const currentFavHomeCookStatus = this.state.isFavoriteHomeCook;
    this.setState({
      isFavoriteHomeCook: !currentFavHomeCookStatus
    })
    console.log("status: ", !currentFavHomeCookStatus);
  }

  onClickUpload = e => {
    this.inputElement.click();
  }

  onImageChange = e => {
    this.setState({
      uploadedImage: e.target.files[0]
    });
    const reader = new FileReader();
    if (e.target.files[0]) {
      const options = {
        maxSizeMB: 1.5,          // (default: Number.POSITIVE_INFINITY)
      }
      imageCompression(e.target.files[0], options)
        .then(res => {
          const url = reader.readAsDataURL(res);
          reader.onloadend = function (e) {
            this.setState({
              avatarURL: [reader.result]
            })
          }.bind(this);
        })
    }
  }

  getHomecooks = () => {
    console.log("LOCATION=" + this.props.email)
    const data = { location: this.props.location, email: this.props.email }
    axios.post(`${serverURL}/getpastfood`, { data: data })
      .then(res => {
        console.log(res.data)
        //console.log(Array.from(res.data.data))
        this.setState({
          pastfood: Array.from(res.data.data)
        });
        console.log(this.state.pastfood)
      })
      .catch(err => {
        Raven.captureException("GetPastFood: " + err);
      })
  }


  render() {
    const { avatarURL } = this.state;
    return (
      <div className="master-container">
        <div className="container profile bg-profile">
          <div className="form-area">
            <Form role="form">
              {this.props.show}
              <br styles="clear:both" />
              <Image className="image-upload-preview" src={avatarURL} fluid thumbnail onClick={this.onClickUpload} roundedCircle />
              <FormControl
                type="file"
                className="image-upload-input"
                onChange={this.onImageChange}
                ref={input => this.inputElement = input}
              />

              <FormGroup controlId="name" className="form-group">
                {/* <Form.Label className='form-text'><h5>Name</h5></Form.Label> */}
                <Form.Label value={this.state.name} className='form-value'><h1>{this.state.name}</h1></Form.Label>
              </FormGroup>
              <FormGroup className="form-group">
                {/* <Form.Label className='form-text'><h5>Email</h5></Form.Label> */}
                <Form.Label value={this.state.name} className='form-value profileEmail'><h5><b>{this.props.email}</b></h5></Form.Label>
              </FormGroup>
              {/* <FormGroup className="form-group">
              <Form.Label className='form-text'><h5>Cuisines</h5></Form.Label>
              <Form.Label value={this.state.name} className='form-value'><h5>{this.state.cuisines}</h5></Form.Label>
            </FormGroup>
            <br /> */}
              <FormGroup controlId="aboutMe" className="form-group">
                <Form.Label className='form-text text-about-me-label'><h6><b>About Me</b></h6></Form.Label>
                <Form.Control value={this.state.aboutMe} type="text" onChange={this.handleChange} className="text-about-me" placeholder={this.state.aboutMe} rows="3" as="textarea" />
                {/* <Textarea value={this.state.aboutMe} type="text" onChange={this.handleAboutMeChange} className="text-about-me" placeholder={this.state.aboutMe} rows="3"></Textarea> */}
              </FormGroup>
              <br />
              <Button
                block
                variant="danger"
                onClick={this.updateProfile}
              >
                Update
            </Button>
              <br />
              <h5><p className='form-text'>Past Food:</p></h5>
              <div className="center-col">
                {this.state.pastfood.map(item => (
                  <FavoriteFood email={this.props.email}
                    picture={item.picture}
                    description={item.description}
                    title={item.name}
                    food_id={item.food_id}
                    price={item.price}
                    isfavfood={item.is_favorite}
                  />
                ))}
              </div>
            </Form>

          </div>
        </div>
      </div>
    )
  }
}