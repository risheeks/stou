import React, { Component } from "react";
import { Row, Col, Container, Button, FormGroup, FormControl, FormLabel, Image, ListGroup, Form } from "react-bootstrap";
import "../../styles/Main.css";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import NavLink from 'react-bootstrap/NavLink';
import axios from 'axios';
import { serverURL } from '../../config';
export default class FavoriteFood extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          isFavoriteFood : this.props.isfavfood,
        };
    }
    componentDidMount = () => {
      console.log("ISFAV=" + this.props.isfavfood)
      this.setState({isFavoriteFood : this.props.isfavfood})
    }

    AddFavoriteFood =(e) => {
      console.log(this.props.email + " " + this.props.food_id);
      axios.post(`${serverURL}/setfavoritefood`, {
          data: {
              email: this.props.email,
              food_id: this.props.food_id
          }
      })
      .then(res => {
          //console.log(res.data);
      })
    }
    RemoveFavoriteFood =(e) => {
      //console.log(this.props.email + " " + this.state.cook_email);
      axios.post(`${serverURL}/removefavoritefood`, {
          data: {
            email: this.props.email,
            food_id: this.props.food_id
          }
      })
      .then(res => {
          //console.log("Reached remove")
          //console.log(res.data);
      })
    }
    ChangeSaveFavFoodStatus =(e)=> {
      const currentFavFoodStatus=this.state.isFavoriteFood;
      this.setState({
        isFavoriteFood: !currentFavFoodStatus
      })
      if(!currentFavFoodStatus) {
        console.log("ADDED")
        this.AddFavoriteFood()
      }
      else {
        console.log("REMOVED")
        this.RemoveFavoriteFood() 
      }
      //console.log("status: ", !currentFavHomeCookStatus);
      //console.log(this.props.cook_email);
  }
    render() {
    return (
    <Container className="ViewFoodOptions">
        <ListGroup>
            <ListGroup.Item className="food-option-view-menu">
              <div className="food-option-inner">
                <div>
                <NavLink className="food-link-name">
                  <Image rounded className="vfo-image" src={this.props.picture} />
                  </NavLink>
                </div>
                <div className="vfo-info">
                  <div className="vfo-foodname">
                  <Form.Label className="food-link-name">
                    <p>{this.props.title}</p>
                  </Form.Label>
                  </div>
                  <div className="vfo-description wrapped-cook-text">
                    <p>{this.props.description}</p>
                  </div>
                  <div className="vfo-description">
                    <p><b>Price: ${this.props.price}</b></p>
                  </div>
                </div>
                <p className="vfo-price">
                <Row onClick={this.ChangeSaveFavFoodStatus} style={{display: this.state.isFavoriteFood ? 'none' : 'block' }}>
                    <i><FaRegHeart className="saveOpenHeart"/></i> 
                </Row>
                <Row onClick={this.ChangeSaveFavFoodStatus} style={{display: this.state.isFavoriteFood ? 'block' : 'none' }}>
                   <i><FaHeart className="saveHeart"/></i>
                </Row>
                </p>
              </div>
            </ListGroup.Item>
        </ListGroup>
      </Container>

    )
  }
}