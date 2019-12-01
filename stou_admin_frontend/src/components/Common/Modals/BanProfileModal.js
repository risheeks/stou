import React, { Component } from "react";
import { Modal, Button, Form, Col, Row, Image } from "react-bootstrap";
import { ModalKey } from '../../../constants/ModalKeys';
import CustomRating from "../CustomRating";
class BanProfileModal extends Component {
    constructor(props) {
      super(props);
    }

    render() {
        let { showModal, closeModal} = this.props;
        console.log(this.props);
        return (
            <Modal show={showModal} onHide={() => closeModal()}>
                <Modal.Header closeButton className="profile-footer-modal">
                <Form.Label className='text-profile-modal'><h1 className='text-profile-name-modal'>User Profile</h1></Form.Label>
                </Modal.Header>
                <Modal.Body>
                <Row>
                    <Col xs="4">
                        <Image className="image-upload-preview-modal" src={this.props.picture} fluid thumbnail roundedCircle />
                    </Col>
                    <Col>
                    <div className="text-profile-flex">
                    <Form.Label className='text-profile-modal'><h1 className='text-profile-name-modal'>{this.props.name}</h1></Form.Label>
                    <Form.Label><h3 className='text-profile-email-modal'>{this.props.email}</h3></Form.Label>
                    <Form.Label><h3 className='text-profile-description-modal'>{this.props.aboutMe ? this.props.aboutMe : "I am passionate about cooking"}</h3></Form.Label>
                    <CustomRating rating="0" readonly={true} bowlSize="30px"/>
                    </div>
                    </Col>
                </Row>
                </Modal.Body>
                <Modal.Footer className="profile-footer-modal">
                    <Button>View Chat History</Button>
                    <Button variant="danger">Ban User</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default BanProfileModal;