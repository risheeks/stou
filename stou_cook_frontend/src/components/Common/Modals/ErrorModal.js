import React, { Component } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

class ErrorModal extends Component {

    render() {
        const { showModal, closeModal } = this.props;

        return (
            <Alert className="alert-fixed" show={showModal} variant="danger" onClose={closeModal} dismissible>
                {this.props.message}
            </Alert>
        );
    }
}

export default ErrorModal;