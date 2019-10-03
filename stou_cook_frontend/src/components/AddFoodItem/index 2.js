import React, { Component } from "react";
import { Button, FormGroup, FormControl, FormLabel, FormCheck, Form, Image } from "react-bootstrap";
import uploadimage from '../../constants/images/uploadimage.png';
// import axios from 'axios';
import "../../styles/Main.css";

export class AddFoodItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      foodname: '',
      price: 0,
      allergens: ['Dairy', 'Shellfish', 'Nuts', 'Eggs', 'Others'],
      calories: 0,
      description: '',
      chosenAllergens: [],
      uploadedImage: uploadimage,
    };
    this.inputElement = React.createRef();
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
    event.preventDefault();
  }

  onCheckChange = (e, allergen) => {
    const { chosenAllergens } = this.state;
    if (e.target.checked) {
      console.log(allergen)
      chosenAllergens.push(allergen)
    } else {
      let index = chosenAllergens.indexOf(allergen);
      chosenAllergens.splice(index, 1);
    }
    this.setState({ chosenAllergens });
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
    const { uploadedImage, allergens } = this.state;

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
            <FormGroup controlId="name" bsSize="large">
              <FormLabel>Name your dish</FormLabel>
              <FormControl className="email"
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
            <div className="checkbox-div">
              <FormGroup controlId="formBasicCheckbox">
                {allergens.map((allergen, index) =>
                  <FormCheck type="checkbox" key={index} onChange={e => this.onCheckChange(e, allergen)} label={allergen} />
                )}
              </FormGroup>
            </div>
            <div>
              <Button
                block
                bsSize="large"
                className="submit-button"
                disabled={!this.validateForm()}
                type="submit"
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

export default AddFoodItem;