import React, { Component } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { ROLE } from '../../../constants';
import axios from 'axios';
import { serverURL } from '../../../config';
import Raven from 'raven-js';

class ZipcodeModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            zipcode: '',
        }
    }

    handleChange = e => {
        if (e.target.value < '99999') {
            this.setState({
                [e.target.id]: e.target.value
            });
        }
    }

    confirmLocation = () => {
        const { closeModal } = this.props;
        const { zipcode } = this.state;
        if(zipcode > '0' && zipcode < '99999' && zipcode.length === 5) {
            this.sendLocation(zipcode);
        }
    }

    sendLocation = zipcode => {
        const { email } = this.props;
        axios.post(`${serverURL}/setlocation`, {
            data: {
                location: zipcode,
                email: email,
                role: ROLE
            }
        })
            .then(res => {
                this.props.changeLocation(zipcode)
                this.props.closeModal();
            }).catch(err => {
                Raven.captureException("SetLocation: " + err);
            })
            
    }

    render() {
        const { showModal } = this.props;

        return (
            <Modal show={showModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Please enter your Zip code</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="zipcode" className="form-group">
                        <Form.Control value={this.state.zipcode} type="number" onChange={this.handleChange} />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={this.confirmLocation}>Confirm</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default ZipcodeModal;