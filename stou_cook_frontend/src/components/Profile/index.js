import React, { Component } from "react";
import { Row, Col, Container, Button, FormGroup, FormControl, FormLabel, Image, ListGroup } from "react-bootstrap";
import axios from 'axios';
import uploadimage from '../../constants/images/wineandcode.png';
import "../../styles/Main.css";


export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.handleAboutMeChange = this.handleAboutMeChange.bind(this);
    this.updateProfile = this.updateProfile.bind(this);
    this.getProfile = this.getProfile.bind(this);
    this.state = {
      name: '',
      email: 'naraya15@purdue.edu',
      cuisines: '',
      aboutMe: '',
      uploadedImage: uploadimage
    };
    this.getProfile();

  }
  componentDidMount() {
    // document.getElementById('addHyperLink').className = "";
    // document.getElementById('homeHyperlink').className = "";
    // document.getElementById('profileHyperlink').className = "active";
    this.getProfile();
  }

  handleAboutMeChange(e) {
    this.setState({ aboutMe: e.target.value })
  }

  updateProfile() {
    this.getProfile();
  }

  getProfile() {
    // console.log("CHECK")
    var apiCall = "http://192.168.43.177:3000";
    apiCall = apiCall + "/profile";
    axios.get(apiCall, {
      params:{
        email: this.state.email,
        role: 'Homecook'
      }
    })
      .then(res => {
        console.log(res);
        this.setState({ name: res.data });
        // this.setState({email: res.data });
        this.setState({cuisines: res.data });
        this.setState({aboutMe: res.data });
    })
  }

  onClickUpload = e => {
    this.inputElement.click();
  }

  onImageChange = e => {
    const reader  = new FileReader();
    if(e.target.files[0]) {
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
          <form role="form">
            {this.props.show}
            <br styles="clear:both" />
            <Image className="image-upload-preview" src={uploadedImage} fluid thumbnail onClick={this.onClickUpload} />
            <FormControl
              type="file"
              className="image-upload-input"
              onChange={this.onImageChange}
              ref={input => this.inputElement = input}
            />
            <br />
            <div className="form-group">
              <p className='form-text'><h5>Name:</h5></p>
              <p value={this.state.name} className='form-value'><h5>{this.state.name}</h5></p>
            </div>
            <br />
            <div className="form-group">
              <p className='form-text'><h5>Email:</h5></p>
              <p value={this.state.name} className='form-value'><h5>{this.state.email}</h5></p>
            </div>
            <br />
            <div className="form-group">
              <p className='form-text'><h5>Cuisines:</h5></p>
              <p value={this.state.name} className='form-value'><h5>{this.state.cuisines}</h5></p>
            </div>
            <br />
            <div className="form-group">
              <p className='form-text'><h5>About Me:</h5></p>
              <textarea value={this.state.aboutMe} type="text" onChange={this.handleAboutMeChange} className="text-about-me" placeholder={this.state.aboutMe} rows="3"></textarea>
            </div>
            <br/>
            <Button
              block
              bsSize="large"
              className="submit-button"
              onClick={this.updateProfile}
              type="submit"
            >
              Update
            </Button>
            <br/>
            <div className="form-group">
              <ListGroup>
                <ListGroup.Item><Container className="ViewFood">
                  <Row>
                      <Col>   
                      <img className="vfo-image rounded float-left" src="https://d1doqjmisr497k.cloudfront.net/-/media/mccormick-us/recipes/mccormick/f/800/fiesta_tacos_800x800.jpg" alr=""></img>
                      </Col>
                      <Col>  
                          <Row className="vfo-foodname">
                          <p>Spicy Pasta</p>
                          </Row>
                          <Row className="vfo-description">
                          <p>tasty italian food lolololololololol</p>
                          </Row>
                      </Col>
                      <Col className="vfo-price">  
                      </Col>
                  </Row>
                </Container></ListGroup.Item>
                <ListGroup.Item><Container className="ViewFood">
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
                </Container></ListGroup.Item>
              </ListGroup>
            </div>
          </form>
        </div>
      </div>
    )
  }
}