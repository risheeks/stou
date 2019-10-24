import React, { Component } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

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
            closeModal();
        }
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