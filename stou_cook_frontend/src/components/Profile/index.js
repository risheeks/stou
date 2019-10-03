import React, { Component } from "react";
import { Button, FormGroup, FormControl, FormLabel, Image } from "react-bootstrap";
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
      email: '',
      phoneNumber: '',
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
    apiCall = apiCall + "/test";
    axios.get(apiCall)
      .then(res => {
        console.log(res.data);
        this.setState({ name: res.data });
    })
    // this.state.name = this.state.persons;
    // this.state.name = 'Risheek Narayanadevarakere';
    this.state.email = 'naraya15@purdue.edu';
    this.state.phoneNumber = '3463427632';
    this.state.cuisines = 'Indian';
    this.state.aboutMe = 'Chill Guy!';
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
              <text className='form-text'><h5>Name:</h5></text>
              <text value={this.state.name} className='form-value'><h5>{this.state.name}</h5></text>
            </div>
            <br />
            <div className="form-group">
              <text className='form-text'><h5>Email:</h5></text>
              <text value={this.state.name} className='form-value'><h5>{this.state.email}</h5></text>
            </div>
            <br />
            <div className="form-group">
              <text className='form-text'><h5>Phone Number:</h5></text>
              <text value={this.state.name} className='form-value'><h5>{this.state.phoneNumber}</h5></text>
            </div>
            <br />
            <div className="form-group">
              <text className='form-text'><h5>Cuisines:</h5></text>
              <text value={this.state.name} className='form-value'><h5>{this.state.cuisines}</h5></text>
            </div>
            <br />
            <div className="form-group">
              <text className='form-text'><h5>About Me:</h5></text>
              <textarea value={this.state.aboutMe} type="text" onChange={this.handleAboutMeChange} className="text-about-me" placeholder={this.state.aboutMe} rows="3"></textarea>
            </div>
            <Button
              block
              bsSize="large"
              className="submit-button"
              onClick={this.updateProfile}
              type="submit"
            >
              Update
              </Button>
          </form>
        </div>
      </div>
    )
  }
}