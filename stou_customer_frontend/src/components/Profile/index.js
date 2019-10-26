import React, { Component } from "react";
import { Row, Col, Container, Button, FormGroup, FormControl, FormLabel, Image, ListGroup, Form } from "react-bootstrap";
import axios from 'axios';
import uploadimage from '../../constants/images/wineandcode.png';
import "../../styles/Main.css";
import imageCompression from 'browser-image-compression';
import firebase from "firebase";
import { serverURL } from "../../config/index.js"
import PaypalExpressBtn from 'react-paypal-express-checkout';
import Spinner from 'react-bootstrap/Spinner'

const firebaseConfig = {
  apiKey: "AIzaSyCKRmXkIQqNtPTM-_MMvsQYMH1tSm7IlNM",
  authDomain: "stou-79b9a.firebaseapp.com",
  databaseURL: "https://stou-79b9a.firebaseio.com",
  projectId: "stou-79b9a",
  storageBucket: "stou-79b9a.appspot.com",
  messagingSenderId: "135234417719",
  appId: "1:135234417719:web:a6233dfcab2935a2e67bb2",
  measurementId: "G-EWZ35B7N17"
};

const CLIENT = {
  sandbox: 'AQz8o-Lc6iEClKWllJjLUo0qT7Sd-ORu0rD-fBiaYNvfErmTm5xM6aAJ2EBSFVaXAC9iVct84qgtDURC',
  production: 'xxxXXX',
};
const ENV = process.env.NODE_ENV === 'production'
  ? 'production'
  : 'sandbox';

export default class Profile extends React.Component {
  constructor(props) {
    let v = "sid";
    super(props);
    this.updateProfile = this.updateProfile.bind(this);
    this.getProfile = this.getProfile.bind(this);
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();
    this.state = {
      name: '',
      email: '',
      //   cuisines: '',
      aboutMe: '',
      uploadedImage: '',
      progress: 0,
      avatarURL: '',
      fireBaseURL: '',
    };
    // this.getProfile();

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
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

  uploadToFireBase = e => {
    //let { fireBaseURL } = this.state;
    
    const self = this;
    let randomID = this.generateUniqueID(25);
    let url='';
    let path = "images/" + randomID;
    let uploadTask = firebase.storage().ref().child(path).put(this.state.uploadedImage);
    uploadTask.on('state_changed', function(snapshot){
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
    }, function(error) {
      // Handle unsuccessful uploads
    }, function() {
      uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
        console.log('File available at', downloadURL);
        url = downloadURL;
        self.setState({fireBaseURL:url});
      });
    });
  
  }
  updateProfile = async e => {
    // this.getProfile();
    const self = this;
    if(!this.state.avatarURL) {
      self.setState({fireBaseURL:"https://firebasestorage.googleapis.com/v0/b/stou-79b9a.appspot.com/o/images%2FYj6nVUBRAQLrvR90IxaG9tYJL?alt=media&token=1601dd22-9bf1-4706-8f84-894cf69580c7"});
    }else if(this.state.avatarURL.toString().startsWith("https://firebasestorage.googleapis.co")) {
      self.setState({fireBaseURL:this.state.avatarURL});
    }else {
      await this.uploadToFireBase();
    }
    setTimeout(function(){
      var apiCall = serverURL;
      
      apiCall = apiCall + "/editProfile";
      console.log("photo URL=" + self.state.fireBaseURL);
      axios.post(`${serverURL}/editProfile`, {
        data: {
          name: self.state.name,
          role: "CUSTOMER",
          aboutMe: self.state.aboutMe,
          profilePicture: self.state.fireBaseURL,
          email:self.props.email,
        }
      })
      .then(res => {
        console.log(res.data);
      })
      //window.location.reload(false);
    }, 2000);
  }


  getProfile = e => {
    var apiCall = serverURL;
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
          if(!this.state.avatarURL) {
            this.setState({avatarURL:"https://firebasestorage.googleapis.com/v0/b/stou-79b9a.appspot.com/o/images%2FYj6nVUBRAQLrvR90IxaG9tYJL?alt=media&token=1601dd22-9bf1-4706-8f84-894cf69580c7"});
          }
        }
      })
      
      
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
onSuccess = (payment) => {
        console.log("The payment was succeeded!", payment);
}

onCancel = (data) => {
    console.log('The payment was cancelled!', data);
}

onError = (err) => {
    console.log("Error!", err);
}

  render() {


  let env = 'sandbox'; 
  let currency = 'USD'; 
  let total = 1; 
  const client = {
      sandbox:    'AQz8o-Lc6iEClKWllJjLUo0qT7Sd-ORu0rD-fBiaYNvfErmTm5xM6aAJ2EBSFVaXAC9iVct84qgtDURC',
      production: 'YOUR-PRODUCTION-APP-ID',
  }
    const { avatarURL } = this.state;
    return (
      <div className="container profile">
        <div className="form-area">
          <Form role="form">
            {this.props.show}
            <br styles="clear:both" />
            <Image className="image-upload-preview" src={avatarURL} fluid thumbnail onClick={this.onClickUpload}/>
            <FormControl
              type="file"
              className="image-upload-input"
              onChange={this.onImageChange}
              ref={input => this.inputElement = input}
            />
            <br />
            <FormGroup controlId="name" className="form-group">
              <Form.Label className='form-text'><h5>Name</h5></Form.Label>
              {/* <Form.Control value={this.state.name} type="text" onChange={this.handleChange} className="text-about-me" placeholder={this.state.name} rows="1" /> */}
              <Form.Label value={this.state.name} className='form-value'><h5>{this.state.name}</h5></Form.Label>
              {/* <p value={this.state.name} className='form-value'><h5>{this.state.name}</h5></p> */}
            </FormGroup>
            <br />
            <FormGroup className="form-group">
              <Form.Label className='form-text'><h5>Email</h5></Form.Label>
              <Form.Label value={this.state.name} className='form-value'><h5>{this.props.email}</h5></Form.Label>
            </FormGroup>
            <br />
            {/* <FormGroup className="form-group">
              <Form.Label className='form-text'><h5>Cuisines</h5></Form.Label>
              <Form.Label value={this.state.name} className='form-value'><h5>{this.state.cuisines}</h5></Form.Label>
            </FormGroup>
            <br /> */}
            <FormGroup controlId="aboutMe" className="form-group">
              <Form.Label className='form-text'><h5>About Me</h5></Form.Label>
              <Form.Control value={this.state.aboutMe} type="text" onChange={this.handleChange} className="text-about-me" placeholder={this.state.aboutMe} rows="3" as="textarea" />
              {/* <Textarea value={this.state.aboutMe} type="text" onChange={this.handleAboutMeChange} className="text-about-me" placeholder={this.state.aboutMe} rows="3"></Textarea> */}
            </FormGroup>
            <br />
            <Button
              block
              bsSize="large"
              className="submit-button"
              onClick={this.updateProfile}
            >
              Update
            </Button>
            <br />
            <div className="form-group">
              <p className='form-text'><h5>Past Food:</h5></p>
              <Container className="ViewFood">
                <ListGroup>
                  <ListGroup.Item>
                    <Row>
                      <Col>
                        <img className="vfo-image rounded float-left" src="https://d1doqjmisr497k.cloudfront.net/-/media/mccormick-us/recipes/mccormick/f/800/fiesta_tacos_800x800.jpg" alr=""></img>
                      </Col>
                      <Col>
                        <Row className="vfo-foodname">
                          <p>Spicy Pasta</p>
                        </Row>
                        <Row className="vfo-description">
                          <p>tasty italian food</p>
                        </Row>
                      </Col>
                      <Col className="vfo-price">
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>
                        <img className="vfo-image rounded float-left" src="https://d1doqjmisr497k.cloudfront.net/-/media/mccormick-us/recipes/mccormick/f/800/fiesta_tacos_800x800.jpg" alr=""></img>
                      </Col>
                      <Col>
                        <Row className="vfo-foodname">
                          <p>Chicken Tikka Masala</p>
                        </Row>
                        <Row className="vfo-description">
                          <p>Delicious Indian food!</p>
                        </Row>
                      </Col>
                      <Col className="vfo-price">
                      </Col>
                    </Row>
                  </ListGroup.Item>
                </ListGroup>
              </Container>
            </div>
          </Form>
            
        </div>
        <PaypalExpressBtn env={env} client={client} currency={currency} total={total} onError={this.onError} onSuccess={this.onSuccess} onCancel={this.onCancel} />
      </div>
      
    )
  }
}