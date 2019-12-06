import React, { Component } from 'react';
import { Modal, Button, Form, FormControl} from 'react-bootstrap';
import { ROLE } from '../../../constants';
import axios from 'axios';
import { serverURL } from '../../../config';
import Raven from 'raven-js';


class FeedbackModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name:'',
            feedback: ''
        };

       
    }


    sendFeedback = () => {
        console.log(this.state.feedback)
        axios.post(`${serverURL}/setfeedback`, {
          data: {
            email: this.props.email,
            feedback: this.state.feedback,
          }
        })
        .then(res => {
          console.log(res.data);
          this.props.closeModal();
        })
        .catch(err => {
            Raven.captureException("SetFeedBack: " + err);
        })
      }
    handleChange = e => {
        this.setState({ [e.target.id]: e.target.value })
    }
    
    render() {
        const { showModal, closeModal} = this.props;

        return (
            <Modal show={showModal} onHide={() => closeModal()}>
                <Modal.Header closeButton>
                    <Modal.Title>Please enter your feedback</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    
                    <br/>
                    <Form.Group controlId="feedback">
                        <Form.Label>Enter Feedback</Form.Label>
                        <Form.Control value={this.state.feedback} as="textarea" rows="3" onChange={this.handleChange}/>
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