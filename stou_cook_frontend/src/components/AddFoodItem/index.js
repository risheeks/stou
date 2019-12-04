import React, { Component } from "react";
import { Button, FormGroup, FormControl, FormLabel, FormCheck, Form, Image, Card, ToggleButton, ToggleButtonGroup } from "react-bootstrap";
import uploadimage from '../../constants/images/uploadimage.png';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import firebase from "firebase";
import imageCompression from 'browser-image-compression';
import "../../styles/Main.css";
import { serverURL } from "../../config/index.js"
import { firebaseConfig } from '../../config';



export class AddFoodItem extends Component {
  constructor(props) {
    super(props);
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
      firebase.analytics();
    }
    this.state = {
      foodname: '',
      price: 0,
      calories: 0,
      zipcode: '',
      description: '',
      uploadedImage: '',
      cuisines: ['Chinese', 'Indian', 'Asian', 'Mexican', 'Japanese', 'Italian', 'Thai', 'French', 'Mediterranean', 'Other'],
      allergens: ['Dairy', 'Shellfish', 'Nuts', 'Eggs', 'Others'],
      chosenAllergens: [],
      chosenCuisines: null,
      firebaseURL: '',
      avatarURL: 'https://firebasestorage.googleapis.com/v0/b/stou-79b9a.appspot.com/o/full_red_logo.png?alt=media&token=47a33c08-e2e9-4d10-929f-3d29154b1d90',
    };
    this.inputElement = React.createRef();
  }

  componentDidMount() {
    if(!this.props.auth_token) {
      this.props.history.push('/login');
    }
  }

  validateForm() {
    return this.state.foodname.length > 2 && this.state.price > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
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
    let path = "fooditems/" + randomID;
    let uploadTask = firebase.storage().ref().child(path).put(this.state.uploadedImage);
    uploadTask.on('state_changed', function(snapshot) {
    let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    switch (snapshot.state) {
      case firebase.storage.TaskState.PAUSED: // or 'paused'
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          break;
      }
    }, function(error) {
      self.handleSubmitCallBack()
    }, function() {
      uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
        url = downloadURL;
        self.setState({fireBaseURL:url}, () => self.handleSubmitCallBack());
      });
    });
  
  }
  handleSubmitCallBack = event => {
    const { foodname, price, calories, description, chosenAllergens, chosenCuisines, fireBaseURL, zipcode} = this.state;
    axios.post(`${serverURL}/addfooditem`, {
      data: {
        homecook: this.props.email,
        itemName: foodname,
        price: price,
        calories: calories,
        description: description,
        allergens: chosenAllergens,
        cuisine: chosenCuisines[0],
        picture: fireBaseURL,
        deliveryTime: zipcode,
        token: this.props.auth_token
      }
    })
      .then(res => {
        this.props.history.push('/orders');
      })
  }

  handleSubmit = event => {
    if(this.state.avatarURL.toString().startsWith("https://firebasestorage.googleapis.co")) {
      this.setState({fireBaseURL:this.state.avatarURL}, () => this.handleSubmitCallBack());
    }else {
      this.uploadToFireBase();
    }
  }

  onAllergenCheckChange = (e, allergen) => {
    const { chosenAllergens } = this.state;
    if (e.target.checked) {
      chosenAllergens.push(allergen);
    } else {
      let index = chosenAllergens.indexOf(allergen);
      chosenAllergens.splice(index, 1);
    }
    this.setState({ chosenAllergens });
  }

  onCuisineCheckChange = (e, cuisine) => {
    if (e.target.checked) {
      this.setState({
        chosenCuisines: cuisine,
      });
    }
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

  render() {
    const { uploadedImage, allergens, cuisines } = this.state;

    return (
      <div className="outer-container">
        <div className="addfood-container">
          <Form onSubmit={this.handleSubmit}>
            <Image className="image-upload-preview" src={this.state.avatarURL} thumbnail onClick={this.onClickUpload} />
            <FormControl
              type="file"
              className="image-upload-input"
              onChange={this.onImageChange}
              ref={input => this.inputElement = input}
            />
            <FormGroup controlId="foodname" bsSize="large">
              <FormLabel>Name your dish</FormLabel>
              <FormControl
                autoFocus
                type="text"
                value={this.state.foodname}
                onChange={this.handleChange}
              />
            </FormGroup>
            <FormGroup controlId="price" bsSize="large">
              <FormLabel>Price</FormLabel>
              <FormControl
                value={this.state.price}
                type="number"
                onChange={this.handleChange}
              />
            </FormGroup>
            <FormGroup controlId="description" bsSize="large">
              <FormLabel>Description</FormLabel>
              <FormControl
                value={this.state.description}
                type="text"
                onChange={this.handleChange}
              />
            </FormGroup>
            <FormGroup controlId="calories" bsSize="large">
              <FormLabel>Calories (kCal)</FormLabel>
              <FormControl
                value={this.state.calories}
                type="number"
                onChange={this.handleChange}
              />
            </FormGroup>
            <FormGroup controlId="zipcode" bsSize="large">
              <FormLabel>Avergage cook time</FormLabel>
              <FormControl
                value={this.state.zipcode}
                // type="number"
                onChange={this.handleChange}
                />
            </FormGroup>
            <div>
              <Card.Title>Allergens</Card.Title>
              <div className="checkbox-div">
                {allergens.map((allergen, index) =>
                  <ToggleButtonGroup className="single-checkbox-div" type="checkbox">
                    <ToggleButton className="single-checkbox" key={index} value={index} onChange={e => this.onAllergenCheckChange(e, allergen)}>{allergen}</ToggleButton>
                  </ToggleButtonGroup>
                )}
              </div>
            </div>
            <hr></hr>
            <div>
              <Card.Title>Cuisines</Card.Title>
              <div className="checkbox-div">
              <ToggleButtonGroup className="multi-checkbox-div" type="radio" name="cuisine">
                {cuisines.map((cuisine, index) =>
                    <ToggleButton className="single-checkbox" id={index} key={index} value={index} type="checkbox" checked={true} onChange={e => this.onCuisineCheckChange(e, cuisine)}>{cuisine}</ToggleButton>
                )}
              </ToggleButtonGroup>
              </div>
            </div>
            <div>
              <Button
                block
                bsSize="large"
                className="submit-button"
                disabled={!this.validateForm()}
                onClick={this.handleSubmit}
              >
                Add Item to Menu
              </Button>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}

export default withRouter(AddFoodItem);