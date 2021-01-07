import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap";
import { Row, Col, Container, FormGroup, FormControl, FormLabel, Image, ListGroup, Form } from "react-bootstrap";
import axios from 'axios';
import { serverURL } from '../../../config';
import { pusher } from '../../../config';
import { ModalKey } from "../../../constants/ModalKeys";
import notificationSound from '../../../constants/sounds/notification.mp3';
import Raven from 'raven-js';
 
class RequestModal extends Component {
    constructor(props) {
      super(props);
      this.state = {
        request: []
      };
    }

    handleChangeRequest = event => {
        
        this.setState({ request: event.target.value });
        
    }

    handleChangeDescription = event => {
        
        this.setState({ description: event.target.value });
        
    }

    acceptRequest = () => {
        //e.preventDefault();
        let { request_item } = this.props;
        const { cookEmail, customerEmail, name, requestId } = request_item;
        axios.post(`${serverURL}/changerequeststatus`, {
            data: {
                requestId: requestId,
                cookEmail: cookEmail,
                customerEmail: customerEmail,
                itemName: name,
                status: 1            
            }
        })
        .then(res => {
            this.props.closeModal();
        })
        .catch(err => {
            Raven.captureException("ChangeReqStatus: " + err);
        })
    }

    rejectRequest = () => {
        //console.log(request);
        //e.preventDefault();
        let {request_item} = this.props;
        const { cookEmail, customerEmail, name, requestId } = request_item;
        axios.post(`${serverURL}/changerequeststatus`, {
            data: {
                requestId: requestId,
                cookEmail: cookEmail,
                customerEmail: customerEmail,
                itemName: name,
                status: 2            
            }
        })
        .then(res => {
            this.props.closeModal();
        })   
        .catch(err => {
            Raven.captureException("ChangeReqStatus: " + err);
        })
    }

    render() {
        let { showModal, closeModal, request_item} = this.props; 
        const {name, description} = request_item;
        return (
            <Modal show={showModal} onHide={() => closeModal()}>
                <Modal.Header closeButton className="profile-footer-modal">
                <Form.Label className='text-profile-modal'><h1 className='text-profile-name-modal'>Request Food</h1></Form.Label>
                </Modal.Header>
                <Modal.Body>
                
                    <Row>
                        <Col>
                            <p><b>Food</b></p>
                            <p className="vfo-description">{name}</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <p><b>Description</b></p>
                            <p className="vfo-description">{description}</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Button 
                                block
                                bsSize="large"
                                variant="danger"
                                onClick={this.rejectRequest}
                                >
                                Decline
                            </Button>
                            <Button 
                                block
                                bsSize="large"
                                variant="success"
                                onClick={this.acceptRequest}
                                >
                                Accept
                            </Button>
                        </Col>
                    </Row>
                </Modal.Body>
              
            </Modal>
        );
    }
}


export default RequestModal;


