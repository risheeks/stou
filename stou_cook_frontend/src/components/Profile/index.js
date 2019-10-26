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
    this.getProfile();
  }

  handleChange = e => {
    this.setState({ [e.target.id]: e.target.value })
  }

  updateProfile = async e => {
    // this.getProfile();
    const self = this;
    
    if(this.state.avatarURL.toString().startsWith("https://firebasestorage.googleapis.co")) {
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
          role: "COOK",
          aboutMe: self.state.aboutMe,
          profilePicture: self.state.fireBaseURL,
          email:self.props.email,
        }
      })
      .then(res => {
        console.log(res.data);
      })
      window.location.reload(false);
    }, 2000);
  }


  getProfile = e => {
    var apiCall = serverURL;
    apiCall = apiCall + "/profile";
    axios.post(`${serverURL}/profile`, {
      data: {
        email: this.props.email,
        role: 'COOK'
      }
    })
      .then(res => {
        if (res.data.name.length > 0) {
          this.setState({
            name: res.data.name,
            nameOrig: res.data.name,
            aboutMe: res.data.aboutMe,
            avatarURL: res.data.profilePicture,
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
        { !this.props.auth_token ? this.props.history.push('/') : null }
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
              <Form.Label value={this.state.name} className='form-value'><h5>{this.props.email}</h5></Form.Label>
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