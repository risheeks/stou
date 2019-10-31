import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap";
import { Row, Col, Container, FormGroup, FormControl, FormLabel, Image, ListGroup, Form } from "react-bootstrap";
import CustomRating from '../../Common/CustomRating';
import NavLink from 'react-bootstrap/NavLink';
import { ModalKey } from '../../../constants/ModalKeys';
class ProfileModal extends Component {
    constructor(props) {
      super(props);
      this.state = {
        
      };
    console.log("MENUMODAL="+this.props.fooditems)
    }
    handleFoodName = (e, foodItem) => {
        // console.log(this.props);
        const { openModal, addToOrder } = this.props;
        e.preventDefault();
        openModal(ModalKey.FOOD_ITEM, {item: foodItem, addToOrder: this.props.addToOrder});
    }

    render() {
        let { showModal, closeModal} = this.props;
        
        return (
            <Modal show={showModal} onHide={() => closeModal()}>
                <Modal.Header closeButton className="profile-footer-modal">
                <Form.Label className='text-profile-modal'><h1 className='text-profile-name-modal'>{this.props.name}'s menu</h1></Form.Label>
                </Modal.Header>
                <Modal.Body>
                {this.props.fooditems ? (
                    <ListGroup>
                    {this.props.fooditems.map(item => (
                        <ListGroup.Item className="food-option-view-menu">
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
                                <p>Calories: {item.calories}</p>
                            </div>
                            {/* <div className="vfo-chefname">
                                <p>by </p><NavLink className="food-link-chef" onClick={this.clickProfile}>{item.homecook}</NavLink>
                            </div> */}
                            {/* <div className="vfo-estimatedTime">
                                <p>Estimated time: {item.delivery_time ? item.delivery_time.toString(): "-"}</p>
                            </div> */}
                            </div>
                            <p className="vfo-price">${item.price}</p>
                        </div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
                ) : (
                    <p>No food to display</p>
                )}
                
                </Modal.Body>
                {/* <Modal.Footer className="profile-footer-modal">
                    <CustomRating rating="0" readonly={true} />
                </Modal.Footer> */}
            </Modal>
        );
    }
}

export default ProfileModal;