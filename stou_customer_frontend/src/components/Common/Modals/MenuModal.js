import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap";
import { Image, ListGroup, Form } from "react-bootstrap";
import NavLink from 'react-bootstrap/NavLink';
import { AiTwotoneFire } from "react-icons/ai";
import { ModalKey } from '../../../constants/ModalKeys';
class MenuModal extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
        // console.log("MENUMODAL=" + this.props.topFood)

    }

    handleFoodName = (e, foodItem) => {
        const { openModal, addToOrder, baggedItems, clearOrder } = this.props;
        e.preventDefault();
        openModal(ModalKey.FOOD_ITEM, { item: foodItem, addToOrder: this.props.addToOrder, baggedItems: baggedItems, clearOrder: clearOrder });
    }

    handleRequest = (e) => {
        //console.log(request);
        const { openModal } = this.props;
        e.preventDefault();
        openModal(ModalKey.REQUEST, { email: this.props.customerEmail, cookEmail: this.props.cookEmail, openModal });
    }

    render() {
        let { showModal, closeModal, topFood } = this.props;

        return (
            <Modal show={showModal} onHide={() => closeModal()}>
                <Modal.Header closeButton className="profile-footer-modal">
                    <Form.Label className='text-profile-modal'><h1 className='text-profile-name-modal'>{this.props.name}'s menu</h1></Form.Label>
                </Modal.Header>
                <Modal.Body>
                    {this.props.topFood ? <i className="fire-text"><p><b>Best Seller</b></p><AiTwotoneFire className="fire-icon" /></i> : null}
                    {this.props.fooditems ? (
                        <div>
                            {this.props.topFood ? <ListGroup className="food-option-view-menu-top">
                                <ListGroup.Item className="food-option-view-menu-top">
                                    <div className="food-option-inner">
                                        <div>
                                            <NavLink className="food-link-name" onClick={e => this.handleFoodName(e, topFood)}>
                                                <Image rounded className="vfo-image" src={topFood.picture} />
                                            </NavLink>
                                        </div>
                                        <div className="vfo-info">
                                            <div className="vfo-foodname">
                                                <NavLink className="food-link-name" onClick={e => this.handleFoodName(e, topFood)}>
                                                    <p>{topFood.name}</p>
                                                </NavLink>
                                            </div>
                                            <div className="vfo-description">
                                                <p>{topFood.description}</p>
                                            </div>
                                            <div className="vfo-description">
                                                <p>Calories: {topFood.calories}</p>
                                            </div>
                                        </div>
                                        <p className="vfo-price">${topFood.price}</p>
                                    </div>
                                </ListGroup.Item>
                            </ListGroup> : null}
                            {this.props.topFood ? <br /> : null}
                            <p><b>Menu</b></p>
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
                                                    <p>{item.description}</p>
                                                </div>
                                                <div className="vfo-description">
                                                    <p>Calories: {item.calories}</p>
                                                </div>
                                            </div>
                                            <p className="vfo-price">${item.price}</p>
                                        </div>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                            <br />
                            <Button variant="danger" block bsSize="large" onClick={e => this.handleRequest(e)}>Request Food</Button>
                        </div>
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

export default MenuModal;