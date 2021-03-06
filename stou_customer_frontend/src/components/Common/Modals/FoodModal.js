import React, { Component } from 'react';
import { Modal, Button, Form, Image, InputGroup, FormControl } from 'react-bootstrap';
import NavLink from 'react-bootstrap/NavLink';

class FoodModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            request: '',
            quantity: 1
        }
    }

    handleChange = e => {
        this.setState({
            [e.target.id]: e.target.value
        });
    }

    addToBag = e => {
        const { item, addToOrder, closeModal, clearOrder, baggedItems } = this.props;
        if(baggedItems.length > 0 && (item.email !== baggedItems[0].email)) {
            clearOrder();
        }
        addToOrder(item, this.state.quantity);
        closeModal();
    }

    renderConfirmClear = () => {
        const { clearOrder, baggedItems, item } = this.props;
        if(baggedItems.length > 0 && (item.email !== baggedItems[0].email)) {
            return (
                <div>
                    <p className="clear-order-info">You already have items from other homecooks. Adding this item will clear your existing bag.</p>    
                </div>
            );
        }
        return null;
    }

    handleQuantityChange = e => {
        if(e.target.value === '') {
            this.setState({
                quantity: ''
            });
            return;
        }
        const newQuantity = parseInt(e.target.value);
        if(newQuantity > 0 && newQuantity < 100) {
            this.setState({
                quantity: newQuantity
            });
        }
    }

    incrementQuantity = e => {
        const newQuantity = parseInt(this.state.quantity) + 1;
        if(newQuantity < 99) {
            this.setState({
                quantity: newQuantity
            });
        }
    }

    decrementQuantity = e => {
        const newQuantity = parseInt(this.state.quantity) - 1;
        if(newQuantity > 0) {
            this.setState({
                quantity: newQuantity
            });
        }
    }

    render() {
        const { showModal, closeModal, item } = this.props;
        const { quantity } = this.state;

        return (
            <Modal show={showModal} onHide={() => closeModal()}>
                <Modal.Header closeButton>
                    <div className="food-option-inner">
                        <div>
                            <Image rounded className="vfo-image" src={item.picture} />
                        </div>
                        <div className="vfo-info-modal">
                            <div className="vfo-foodname">
                                <p>{item.name}</p>
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
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="request" className="form-group">
                        <Form.Control value={this.state.request} placeholder="Special requests..." type="text" onChange={this.handleChange} />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer className="food-modal-footer">
                    {this.renderConfirmClear()}
                    <div className="food-modal-add">
                    <InputGroup className="quantity-input-div">
                        <InputGroup.Prepend>
                            <Button variant="outline-secondary" onClick={this.decrementQuantity}>-</Button>
                        </InputGroup.Prepend>
                        <FormControl
                            value={quantity}
                            onChange={this.handleQuantityChange}
                            className="quantity-input"
                        />
                        <InputGroup.Append>
                            <Button variant="outline-secondary" onClick={this.incrementQuantity}>+</Button>
                        </InputGroup.Append>
                    </InputGroup>
                    <Button variant="success" disabled={quantity === ''} onClick={this.addToBag}>Add to Bag</Button>
                    </div>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default FoodModal;