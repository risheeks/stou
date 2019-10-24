import React, { Component } from 'react';
import { Modal, Button, Form, Image } from 'react-bootstrap';
import NavLink from 'react-bootstrap/NavLink';

class FoodModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            request: '',
        }
    }

    handleChange = e => {
        this.setState({
            [e.target.id]: e.target.value
        });
    }

    addToBag = e => {
        const { item, addToOrder, closeModal } = this.props;
        addToOrder(item, 1);
        closeModal();
    }

    render() {
        const { showModal, closeModal, item } = this.props;

        return (
            <Modal show={showModal} onHide={() => closeModal()}>
                <Modal.Header closeButton>
                    <div className="food-option-inner">
                        <div>
                            <Image rounded className="vfo-image" src={item.picture} />
                        </div>
                        <div className="vfo-info">
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
                <Modal.Footer>
                    <Button variant="success" onClick={this.addToBag}>Add to Bag</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default FoodModal;