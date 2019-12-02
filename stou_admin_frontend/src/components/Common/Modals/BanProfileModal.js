import React, { Component } from "react";
import { Modal, Button, Form, Col, Row, Image } from "react-bootstrap";
import { ModalKey } from '../../../constants/ModalKeys';
import CustomRating from "../CustomRating";
import axios from 'axios';
import { serverURL } from "../../../config";

class BanProfileModal extends Component {
    constructor(props) {
      super(props);
    }

    changeBanStatus = e => {
        const data = {
            email: this.props.email,
            role: this.props.role,
            status: !this.props.banStatus
        }
        axios.post(`${serverURL}/changebanstatus`, { data })
            .then(res => {
                console.log(res.data);
                this.props.reloadAfterBan();
                this.props.closeModal();
            })
    }

    render() {
        let { showModal, closeModal} = this.props;
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
                    <Button variant={this.props.banStatus ? "success" : "danger"} onClick={this.changeBanStatus}>{this.props.banStatus ? 'Un' : ''}Ban User</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default BanProfileModal;