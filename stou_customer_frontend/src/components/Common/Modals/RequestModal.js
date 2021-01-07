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
        request: '',
        description: ''
      };
    }

    handleChangeRequest = event => {
        
        this.setState({ request: event.target.value });
        
    }

    handleChangeDescription = event => {
        
        this.setState({ description: event.target.value });
        
    }

    AddRequest = () => {
        const { openModal, closeModal } = this.props;

        axios.post(`${serverURL}/addrequest`, {
            data: {
                cookEmail: this.props.cookEmail,
                customerEmail: this.props.email,
                itemName: this.state.request,
                itemDescription: this.state.description            
            }
        })
        .then(res => {
            let channel = pusher.subscribe(`cook-${this.props.cookEmail}`);
            channel.bind('new-request', function (data) {

            const audio = new Audio(notificationSound);
            audio.play();
            openModal(ModalKey.NEW_ORDER, {...data});
            closeModal();
            });
        }).catch(err => {
            Raven.captureException("AddRequest: " + err);
        })
    }

    render() {
        let { showModal, closeModal, description} = this.props;
        
        return (
            <Modal show={showModal} onHide={() => closeModal()}>
                <Modal.Header closeButton className="profile-footer-modal">
                <Form.Label className='text-profile-modal'><h1 className='text-profile-name-modal'>Request Food</h1></Form.Label>
                </Modal.Header>
                <Modal.Body>
                <Row>
                    <Col>
                        <FormGroup controlId="requests" bsSize="large">
                            <FormLabel>
                                Food:
                                <FormControl
                                    type="text"
                                    name="requests"
                                    className=""
                                    value={this.state.request}
                                    onChange={this.handleChangeRequest}
                                />
                             </FormLabel>
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <FormGroup controlId="homecook" bsSize="large">
                            <FormLabel>
                              Description:
                            <FormControl
                              type="text"
                              name="requestHomeCook"
                              className=""  
                              value={this.state.description}
                              onChange={this.handleChangeDescription}
                            />
                            </FormLabel>
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Button 
                            block
                            bsSize="large"
                            variant="danger"
                            onClick={this.AddRequest}
                            >
                            Submit
                        </Button>
                    </Col>
                </Row>
                </Modal.Body>
                
            </Modal>
        );
    }
}


export default RequestModal;


