import React, { Component } from "react";
import { Row, Col, Container, Button, FormGroup, FormControl, FormLabel, Image, ListGroup, Form } from "react-bootstrap";
import axios from 'axios';
import uploadimage from '../../constants/images/wineandcode.png';
import "../../styles/Main.css";
import { serverURL } from "../../config";
import { withRouter } from 'react-router-dom';

class Profile extends React.Component {
  constructor(props) {
    super(props);
    // this.updateProfile = this.updateProfile.bind(this);
    // this.getProfile = this.getProfile.bind(this);
    this.state = {
      name: '',
      email: 'chef@chef.com',
      cuisines: '',
      aboutMe: '',
      uploadedImage: uploadimage
    };
    // this.getProfile();

  }
  componentDidMount() {
    if(!this.props.loggedIn) {
      this.props.history.push('/login');
    }
    this.getProfile();
  }

  handleChange = e => {
    this.setState({ [e.target.id]: e.target.value })
  }

  updateProfile = e => {
    // this.getProfile();
    var apiCall = "http://192.168.43.177:3000";
    apiCall = apiCall + "/editProfile";
    console.log(this.state.aboutMe);
    axios({
      method: 'post',
      url: apiCall,
      data: {
        email: this.state.email,
        name: this.state.name,
        aboutMe: this.state.aboutMe,
        uploadimage: this.state.uploadedImage
      }
      
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
        email: this.state.email,
        role: 'Homecook'
      }
    })
      .then(res => {
        // console.log(res.data);
        this.setState({ name: res.data.name });
        // this.setState({email: res.data });
        this.setState({ cuisines: res.data.cuisines });
        this.setState({ aboutMe: res.data.aboutMe });
      })
  }

  onClickUpload = e => {
    this.inputElement.click();
  }

  onImageChange = e => {
    const reader = new FileReader();
    //var base64 = this.getBase64Image(document.getElementById("ppimage"));

  
    if (e.target.files[0]) {
      const url = reader.readAsDataURL(e.target.files[0]);
      reader.onloadend = function (e) {
        this.setState({
          uploadedImage: [reader.result]
        })
      }.bind(this);
    }
  }

  render() {
    const { uploadedImage } = this.state;
    return (
      <div className="container profile">
        <div className="form-area">
          <Form role="form">
            {this.props.show}
            <br styles="clear:both" />
            <Image className="image-upload-preview" id="ppimage"src={uploadedImage} fluid thumbnail onClick={this.onClickUpload} />
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
              <Form.Label value={this.state.name} className='form-value'><h5>{this.state.email}</h5></Form.Label>
            </FormGroup>
            <br />
            <FormGroup className="form-group">
              <Form.Label className='form-text'><h5>Cuisines</h5></Form.Label>
              <Form.Label value={this.state.name} className='form-value'><h5>{this.state.cuisines}</h5></Form.Label>
            </FormGroup>
            <br />
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
      </div>
    )
  }
}

export default withRouter(Profile);