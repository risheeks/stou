import React, { Component } from "react";
import { Modal, Button, Form, Col, Row, Image } from "react-bootstrap";
import MessageList from "../../Chat/MessageList";

class MessageListModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: this.props.currentUser
        }
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