import React, { Component } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { ROLE } from '../../../../constants';
import axios from 'axios';
import { serverURL } from '../../../../config';
import CustomRating from '../../CustomRating';

class RatingModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            review: '',
        }
    }

    handleChange = e => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    render() {
        const { showModal, closeModal } = this.props;

        return (
            <Modal show={showModal} onHide={() => closeModal()}>
                <Modal.Header closeButton>
                    <Modal.Title>How was your experience with your last order?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="rating-modal-div">
                        <CustomRating rating={0} readonly={false} bowlSize="50px" />
                    </div>
                    <Form.Group controlId="review" className="form-group">
                        <Form.Control as="textarea" value={this.state.review} type="text" onChange={this.handleChange} placeholder="Write your review..." />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={this.confirmLocation}>Confirm</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default RatingModal;    