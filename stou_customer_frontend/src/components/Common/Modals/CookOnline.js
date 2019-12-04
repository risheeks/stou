import React, { Component } from 'react';
import { Modal, Button, Form, Alert, Toast, Fade } from 'react-bootstrap';

class CookOnline extends Component {

    render() {
        const { showModal, closeModal, cook } = this.props;
        const { picture, name, time } = cook;
        return (
            <Toast show={showModal} autohide className="notification-toast" delay={5000} onClose={closeModal}>
                <Toast.Header>
                    <img src={picture} className="rounded mr-2 notification-picture" alt="" />
                    <strong className="mr-auto">{name}</strong>
                    
                </Toast.Header>
                <Toast.Body>Hey, I am online! Order Now!</Toast.Body>
            </Toast>
        );
    }
}

export default CookOnline;