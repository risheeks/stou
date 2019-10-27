import React, { Component } from "react";
import { Button, FormGroup, FormControl, FormLabel, FormCheck, Form, Image, Card, ToggleButton, ToggleButtonGroup } from "react-bootstrap";
import uploadimage from '../../constants/images/uploadimage.png';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import "../../styles/Main.css";
import { serverURL } from '../../config';
import FileUploader from "react-firebase-file-uploader";
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

export class AddFoodItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      foodname: '',
      price: 0,
      calories: 0,
      description: '',
      uploadedImage: uploadimage,
      cuisines: ['Chinese', 'Indian', 'Asian', 'Mexican', 'Japanese', 'Italian', 'Thai', 'French', 'Mediterranean'],
      allergens: ['Dairy', 'Shellfish', 'Nuts', 'Eggs', 'Others'],
      chosenAllergens: [],
      chosenCuisines: [],
    };
    this.inputElement = React.createRef();
  }

  componentDidMount() {
    console.log(this.props.auth_token);
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

  handleSubmit = event => {
    const { foodname, price, calories, description, chosenAllergens, chosenCuisines, uploadedImage } = this.state;
    event.preventDefault();
    axios.post(`${serverURL}/addfooditem`, {
      data: {
        itemName: foodname,
        price: price,
        calories: calories,
        description: description,
        allergens: chosenAllergens,
        cuisine: chosenCuisines[0],
        picture: 'sample',//uploadedImage,
        location: '47906',
        token: this.props.auth_token
      }
    })
      .then(res => {
        console.log(res.data);
      })
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
    const { chosenCuisines } = this.state;
    if (e.target.checked) {
      chosenCuisines.push(cuisine);
    } else {
      let index = chosenCuisines.indexOf(cuisine);
      chosenCuisines.splice(index, 1);
    }
    this.setState({ chosenCuisines });
  }

  onClickUpload = e => {
    this.inputElement.click();
  }

  onImageChange = e => {
    const reader = new FileReader();
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
    const { uploadedImage, allergens, cuisines } = this.state;

    return (
      <div className="outer-container">
        <div className="addfood-container">
          <Form onSubmit={this.handleSubmit}>
            <Image className="image-upload-preview" src={uploadedImage} thumbnail onClick={this.onClickUpload} />
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
                {cuisines.map((cuisine, index) =>
                  <ToggleButtonGroup className="single-checkbox-div" type="checkbox">
                    <ToggleButton className="single-checkbox" key={index} value={index} onChange={e => this.onCuisineCheckChange(e, cuisine)}>{cuisine}</ToggleButton>
                  </ToggleButtonGroup>
                )}
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