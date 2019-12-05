import React, { Component } from 'react';
import { Modal, Button, Form, Alert, Toast, Fade } from 'react-bootstrap';

class DeclineRequestModal extends Component {

    render() {
        const { showModal, closeModal, request_item} = this.props;
        const {name} = request_item;
        return (
            <Toast show={showModal} autohide className="notification-toast" delay={5000} onClose={closeModal}>
                <Toast.Body>Hey, your request for {name} has been declined!</Toast.Body>
            </Toast>
        );
    }
}

export default DeclineRequestModal;