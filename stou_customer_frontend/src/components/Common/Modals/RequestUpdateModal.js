import React, { Component } from 'react';
import { Modal, Button, Alert, Toast } from 'react-bootstrap';

class RequestUpdateModal extends Component {

    render() {
        const { showModal, closeModal, request_item} = this.props;
        const { name, status, cookName, picture } = request_item;
        return (
            <Toast show={showModal} autohide className="notification-toast" delay={5000} onClose={closeModal}>
                <Toast.Header>
                    <img src={picture} className="rounded mr-2 notification-picture" alt="" />
                    <strong className="mr-auto">{cookName}</strong>
                </Toast.Header>
                <Toast.Body>Hey, your request for {name} has been {status}!</Toast.Body>
            </Toast>
        );
    }
}

export default RequestUpdateModal;