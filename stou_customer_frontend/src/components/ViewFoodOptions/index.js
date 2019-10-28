import React, { Component } from 'react';
import { Row, Col, Container, Button, ListGroup, FormControl, FormLabel, Image } from "react-bootstrap";
import axios from 'axios';
import { serverURL } from '../../config';
import NavLink from 'react-bootstrap/NavLink';
import { ModalKey } from '../../constants/ModalKeys';
import full_white_logo from '../../constants/images/full_white_logo.png';

class ViewFoodOptions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      foodoptions: [],
    };
  }

  componentDidMount() {
    if (this.props.allergens.length <= 0 && this.props.cuisines.length <= 0 && this.props.location) {
      const data = { location: this.props.location }
      axios.post(`${serverURL}/getallfood`, { data: data })
        .then(res => {
          console.log(res.data)
          console.log(Array.from(res.data.data));
          this.setState({
            foodoptions: Array.from(res.data.data)
          });
        })
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.allergens.length <= 0 && this.props.cuisines.length <= 0 && this.props !== prevProps) {
      const data = { location: this.props.location }
      axios.post(`${serverURL}/getallfood`, { data: data })
        .then(res => {
          console.log(res.data)
          console.log(Array.from(res.data.data));
          this.setState({
            foodoptions: Array.from(res.data.data)
          });
        })
    }
    if ((this.props.allergens.length > 0 || this.props.cuisines.length > 0) && (this.props.allergens !== prevProps.allergens || this.props.cuisines !== prevProps.cuisines)) {
      const data = {
        allergens: this.props.allergens.toString(),
        cuisines: this.props.cuisines.toString(),
        location: this.props.location
      }
      axios.post(`${serverURL}/filter`, { data: data })
        .then(res => {
          console.log(Array.from(res.data.data))
          this.setState({
            foodoptions: Array.from(res.data.data)
          })
        })
        .catch(err => {
          this.setState({
            foodoptions: []
          });
        })
    }
    else if ((this.props.allergens !== prevProps.allergens || this.props.cuisines !== prevProps.cuisines) && (this.props.allergens.length <= 0 && this.props.cuisines.length <= 0)) {
      const data = { location: this.props.location }
      axios.post(`${serverURL}/getallfood`, { data: data })
        .then(res => {
          console.log(res.data)
          console.log(Array.from(res.data.data));
          this.setState({
            foodoptions: Array.from(res.data.data)
          });
        })
    }
  }

  handleFoodName = (e, foodItem) => {
    console.log(this.props);
    const { openModal, addToOrder } = this.props;
    e.preventDefault();
    openModal(ModalKey.FOOD_ITEM, {item: foodItem, addToOrder: addToOrder});
  }

  render() {
    return (
      <Container className="ViewFoodOptions">
        <ListGroup>
          {this.state.foodoptions.map(item => (
            <ListGroup.Item className="food-option">
              <div className="food-option-inner">
                <div>
                <NavLink className="food-link-name" onClick={e => this.handleFoodName(e, item)}>
                  <Image rounded className="vfo-image" src={item.picture} />
                  </NavLink>
                </div>
                <div className="vfo-info">
                  <div className="vfo-foodname">
                  <NavLink className="food-link-name" onClick={e => this.handleFoodName(e, item)}>
                    <p>{item.name}</p>
                  </NavLink>
                  </div>
                  <div className="vfo-description">
                    <p>{item.description}</p>
                  </div>
                  <div className="vfo-chefname">
                    <p>by </p><NavLink className="food-link-chef">{item.homecook}</NavLink>
                  </div>
                </div>
                <p className="vfo-price">${item.price}</p>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Container>
    )
  }

}
export default ViewFoodOptions