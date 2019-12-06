import React, { Component } from "react";
import { Modal, Button, Form, Col, Row, Image } from "react-bootstrap";
import MessageList from "../../ChatHistory/MessageList";
import { ModalKey } from '../../../constants/ModalKeys';

class MessageListModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: this.props.currentUser
        }
    }

    handleBackButton = e =>{
        const { openModal, retProps} = this.props;
        openModal(ModalKey.BAN_PROFILE, { ...retProps})
    }

    render() {
        let { showModal, closeModal } = this.props;
        return (
            <Modal show={showModal} onHide={() => closeModal()}>
                <Modal.Header closeButton className="profile-footer-modal">
                    <Form.Label className='text-profile-modal'><h1 className='text-profile-name-modal'>{this.props.roomName}</h1></Form.Label>
                </Modal.Header>
                <Modal.Body>
                    <MessageList messages={this.props.messages}/>
                </Modal.Body>
                <Modal.Footer className="profile-footer-modal">
                    <Button onClick={this.handleBackButton}>Back</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default MessageListModal;