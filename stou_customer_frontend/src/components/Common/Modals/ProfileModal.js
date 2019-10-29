import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap";
import { Row, Col, Container, FormGroup, FormControl, FormLabel, Image, ListGroup, Form } from "react-bootstrap";

class ProfileModal extends Component {
    constructor(props) {
      super(props);
      this.state = {
        
      };
    }

    render() {
        const { showModal, closeModal } = this.props;

        return (
            <Modal show={showModal} onHide={() => closeModal()}>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                <Image className="image-upload-preview-modal" src={this.props.picture} fluid thumbnail roundedCircle />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success">Add to Bag</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default ProfileModal;