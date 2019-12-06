import React, { Component } from 'react';
import { Row, Col, Container, Button, ListGroup, FormControl, FormLabel, Image } from "react-bootstrap";
import axios from 'axios';
import { serverURL } from '../../config';
import NavLink from 'react-bootstrap/NavLink';
import { ModalKey } from '../../constants/ModalKeys';
import { FaTruck } from "react-icons/fa";
import Raven from 'raven-js';

class ViewFoodOptions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      foodoptions: [],
    };
  }

  handleFoodName = (e, foodItem) => {
    // console.log(this.props);
    const { openModal, addToOrder, baggedItems, clearOrder } = this.props;
    e.preventDefault();
    openModal(ModalKey.FOOD_ITEM, {item: foodItem, addToOrder: addToOrder, baggedItems: baggedItems, clearOrder});
  }

  clickProfile = e => {
    const { name, description, picture, rating, openModal } = this.props;
    openModal(ModalKey.PROFILE, {name, description, picture, rating});
}

  render() {
    return (
      <Container className="ViewFoodOptions">
        <ListGroup>
          {this.props.foodoptions && this.props.foodoptions.length > 0 ? this.props.foodoptions.map(item => (
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
                    <p className="delivery-time">by </p><NavLink className="food-link-chef delivery-time">{item.homecook}</NavLink>
                  </div>
                </div>
                <div>
                <p className="vfo-price">${item.price}</p>
                <div className="vfo-time">
                  <i className="eyeViews-text"><FaTruck />  {item.delivery_time ? item.delivery_time.toString(): "-"} mins</i>
                  </div>
                </div>
              </div>
            </ListGroup.Item>
          )) : null}
        </ListGroup>
      </Container>
    )
  }

}
export default ViewFoodOptions