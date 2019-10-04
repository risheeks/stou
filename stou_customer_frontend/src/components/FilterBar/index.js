import React, { Component } from "react";
import { Button, FormGroup, FormControl, FormLabel, FormCheck, Form, ToggleButton, ToggleButtonGroup, Card } from "react-bootstrap";
import { Link } from 'react-router-dom';
import axios from 'axios';

export class FilterBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cuisines: ['Chinese', 'Indian', 'Asian', 'Mexican', 'Japanese', 'Italian', 'Thai', 'French', 'Mediterranean'],
      allergens: ['Dairy', 'Shellfish', 'Nuts', 'Eggs', 'Others'],
      chosenAllergens: [],
      chosenCuisines: [],
      price: '26',
    };
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

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = event => {
    const { chosenAllergens, chosenCuisines, price } = this.state;
    const data = {
      allergens: chosenAllergens,
      cuisines: chosenCuisines,
      price: price
    }
    axios.post(`http://192.168.43.177:3000/filter`, { data: data})
      .then(res => {
        console.log(res.data);
      })
  }

  getSelectedPrice = () => {
    if (this.state.price === '26') {
      return '25+';
    }
    return this.state.price;
  }

  render() {
    const { allergens, cuisines } = this.state;

    return (
      <Card className="filterbar-container">
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
        <hr></hr>
        <Card.Title>Price</Card.Title>
        <div className="basic-horizontal-div">
          <p className="price-range-text">$1 </p>
          <FormGroup controlId="price">
            <FormControl
              type="range"
              onChange={this.handleChange}
              value={this.state.price}
              min={1}
              max={26}
            />
          </FormGroup>
          <p className="price-range-text"> $25+</p>
        </div>
        <p className="price-range-text">${this.getSelectedPrice()}</p>
        <div>
          <Button
            block
            bsSize="large"
            className="submit-button filter-button"
            type="submit"
            onClick={this.handleSubmit}
          >
            Filter
            </Button>
        </div>
      </Card>
    );
  }
}

export default FilterBar;