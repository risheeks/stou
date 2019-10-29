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
        let { showModal, closeModal, description} = this.props;
        
        return (
            <Modal show={showModal} onHide={() => closeModal()}>
                <Modal.Header closeButton className="profile-footer-modal">
                <Form.Label className='text-profile-modal'><h1 className='text-profile-name-modal'>{this.props.name}</h1></Form.Label>
                </Modal.Header>
                <Modal.Body>
                <Row>
                    <Col xs="4">
                        <Image className="image-upload-preview-modal" src={this.props.picture} fluid thumbnail roundedCircle />
                    </Col>
                    <Col>
                    <Form.Label><h1 className='text-profile-description-modal'>{this.props.description ? this.props.description : "I am pationate about cooking"}</h1></Form.Label>
                    </Col>
                </Row>
                </Modal.Body>
                <Modal.Footer className="profile-footer-modal">
                    
                </Modal.Footer>
            </Modal>
        );
    }
}

export default ProfileModal;