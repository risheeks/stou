import React, { Component } from 'react';
import { Modal, Button, Form, FormControl} from 'react-bootstrap';
import axios from 'axios';
import { serverURL } from '../../../config';

class ShareappModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            share_email: ''
        };

       
    }


    shareApp = () => {
        console.log("SHARE APP")
    //     console.log(this.state.feedback)
    //     axios.post(`${serverURL}/setfeedback`, {
    //       data: {
    //         email: this.props.email,
    //         feedback: this.state.feedback,
    //       }
    //     })
    //     .then(res => {
    //       console.log(res.data);
    //     })
    //   }
    }
    handleChange = e => {
        this.setState({ [e.target.id]: e.target.value })
    }
    
    render() {
        const { showModal, closeModal} = this.props;

        return (
            <Modal show={showModal} onHide={() => closeModal()}>
                <Modal.Header closeButton>
                    <Modal.Title>Please enter your friend's email</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    
                    <br/>
                    <Form.Group controlId="share_email">
                        <Form.Label>Enter Email</Form.Label>
                        <Form.Control type="email" value={this.state.share_email} onChange={this.handleChange}/>
                        
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={this.shareApp}>Share App!</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default ShareappModal;