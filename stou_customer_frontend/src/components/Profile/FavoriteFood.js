import React, { Component } from "react";
import { Row, Col, Container, Button, FormGroup, FormControl, FormLabel, Image, ListGroup, Form } from "react-bootstrap";
import "../../styles/Main.css";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import NavLink from 'react-bootstrap/NavLink';
export default class FavoriteFood extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          isFavoriteHomeCook : true,
        };
    }

    componentDidMount() {
        console.log(this.props.email + " " + this.props.food_id)
    }
    ChangeSaveFavHomeCookStatus =(e)=> {
        const currentFavHomeCookStatus=this.state.isFavoriteHomeCook;
        this.setState({
            isFavoriteHomeCook: !currentFavHomeCookStatus
        })
        console.log("status: ", !currentFavHomeCookStatus);
    }
    render() {
    return (
    //     <Container className="ViewFood">   
    //     <ListGroup>
    //         <ListGroup.Item>
    //         <Row>
    //             <Col>
    //             <img className="vfo-image rounded float-left" src={this.props.picture} alr=""></img>
    //             </Col>
    //             <Col>
    //             <Row onClick={this.ChangeSaveFavHomeCookStatus} style={{display: this.state.isFavoriteHomeCook ? 'none' : 'block' }}>
    //                 <i><FaRegHeart className="saveOpenHeart"/></i> 
    //             </Row>
    //             <Row onClick={this.ChangeSaveFavHomeCookStatus} style={{display: this.state.isFavoriteHomeCook ? 'block' : 'none' }}>
    //                 <i><FaHeart className="saveHeart"/></i>
    //             </Row>
    //             <Row className="vfo-foodname">
    //                 <p>{this.props.title}</p>
    //             </Row>
    //             <Row className="vfo-description">
    //                 <p>{this.props.description}</p>
    //             </Row>
    //             </Col>
    //             <Col className="vfo-price">
    //             </Col>
    //         </Row>
    //         </ListGroup.Item>
    //     </ListGroup>
    //   </Container>
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
                <Row onClick={this.ChangeSaveFavHomeCookStatus} style={{display: this.state.isFavoriteHomeCook ? 'none' : 'block' }}>
                    <i><FaRegHeart className="saveOpenHeart"/></i> 
                </Row>
                <Row onClick={this.ChangeSaveFavHomeCookStatus} style={{display: this.state.isFavoriteHomeCook ? 'block' : 'none' }}>
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