import React, { Component } from 'react';
import { Modal, Button, Form, FormControl} from 'react-bootstrap';
import { ROLE } from '../../../constants';
import axios from 'axios';
import { serverURL } from '../../../config';

class FeedbackModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name:''
        };

       
    }
    
    sendFeedback = () => {
        console.log("Send feedback")

    }

    render() {
        const { showModal, closeModal} = this.props;

        return (
            <Modal show={showModal} onHide={() => closeModal()}>
                <Modal.Header closeButton>
                    <Modal.Title>Please enter your feedback</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormControl
                        placeholder="Enter name"
                        value={this.state.name}
                        type="text"
                    />
                    <br/>
                    <Form.Group controlId="feedback">
                        <Form.Label>Enter Feedback</Form.Label>
                        <Form.Control as="textarea" rows="3" />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={this.sendFeedback}>Send Feedback!</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default FeedbackModal;