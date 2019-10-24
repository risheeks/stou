import React, { Component } from "react";
import { Row, Col, Container, Button, FormGroup, FormControl, FormLabel, Image, ListGroup, Form } from "react-bootstrap";
import axios from 'axios';
import uploadimage from '../../constants/images/wineandcode.png';
import "../../styles/Main.css";
import imageCompression from 'browser-image-compression';
import firebase from "firebase";
import FileUploader from "react-firebase-file-uploader";
import { serverURL } from "../../config/index.js"
import PaypalExpressBtn from 'react-paypal-express-checkout';

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
    console.log(btoa(atob(v)))
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
      uploadedImage: uploadimage,
      isUploading: false,
      progress: 0,
      avatarURL: uploadimage
    };
    // this.getProfile();

  }
  handleChangeUsername = event =>
    this.setState({ username: event.target.value });
  handleUploadStart = () => this.setState({ isUploading: true, progress: 0 });
  handleProgress = progress => this.setState({ progress });
  handleUploadError = error => {
    this.setState({ isUploading: false });
    console.error(error);
  };
  handleUploadSuccess = filename => {
    this.setState({ avatar: filename, progress: 100, isUploading: false });
    firebase
      .storage()
      .ref("images")
      .child(filename)
      .getDownloadURL()
      .then(url => this.setState({ avatarURL: url }));
  };
  componentDidUpdate(prevProps) {
    console.log(this.props.email);
    if (this.props.email && this.props.email != 'undefined' && this.props.email !== prevProps.email) {
      this.getProfile();
    }
  }

  handleChange = e => {
    this.setState({ [e.target.id]: e.target.value })
  }

  updateProfile = e => {
    // this.getProfile();

    var apiCall = serverURL;
    apiCall = apiCall + "/editProfile";
    console.log("update profile called");
    console.log("photo URL=" + this.state.avatarURL);
    axios.post(apiCall, {
        name: this.state.name,
        aboutMe: this.state.aboutMe,
        profilePicture: this.state.avatarURL,
        email:this.props.email
    })
      .then(res => {
        console.log(res.data);
      })
  }

  getProfile = e => {
    // console.log("CHECK")
    var apiCall = serverURL;
    apiCall = apiCall + "/profile";
    axios.get(apiCall, {
      params: {
        email: btoa(this.props.email),
        role: 'Customer'
      }
    })
      .then(res => {
        if (res.data.name.length > 0) {
          this.setState({
            name: btoa(res.data.name),
            aboutMe: res.data.aboutMe,
            uploadedImage: res.data.profilePicture,
            email: res.data.email
          });
        }
      })
  }

  onClickUpload = e => {
    this.inputElement.click();
  }

  onImageChange = e => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      const options = {
        maxSizeMB: 0.007,          // (default: Number.POSITIVE_INFINITY)
      }
      imageCompression(e.target.files[0], options)
        .then(res => {
          const url = reader.readAsDataURL(res);
          reader.onloadend = function (e) {
            this.setState({
              uploadedImage: [reader.result]
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
    const { uploadedImage } = this.state;
    return (
      <div className="container profile">
        <div className="form-area">
          <Form role="form">
            {this.props.show}
            <br styles="clear:both" />
            <Image className="image-upload-preview" src={uploadedImage} fluid thumbnail onClick={this.onClickUpload} />
            <FileUploader
              accept="image/*"
              name="avatar"
              randomizeFilename
              storageRef={firebase.storage().ref("images")}
              onUploadStart={this.handleUploadStart}
              onUploadError={this.handleUploadError}
              onUploadSuccess={this.handleUploadSuccess}
              onProgress={this.handleProgress}
            />
            <FormControl
              type="file"
              className="image-upload-input"
              onChange={this.onImageChange}
              ref={input => this.inputElement = input}
            />
            <br />
            <FormGroup controlId="name" className="form-group">
              <Form.Label className='form-text'><h5>Name</h5></Form.Label>
              <Form.Control value={this.state.name} type="text" onChange={this.handleChange} className="text-about-me" placeholder={this.state.name} as="textarea" rows="1" />
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