import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap";
import { Row, Col, Container, FormGroup, FormControl, FormLabel, Image, ListGroup, Form } from "react-bootstrap";
import axios from 'axios';
import { serverURL } from '../../../config';
import { pusher } from '../../../config';
import { ModalKey } from "../../../constants/ModalKeys";
 class RequestModal extends Component {
    constructor(props) {
      super(props);
      this.state = {
        request: '',
        description: ''
      };
    }

    AddRequest = () => {
        //console.log(this.state.feedback)

        axios.post(`${serverURL}/addrequest`, {
          data: {
            cookEmail: this.props.email,
            customerEmail: this.props.cookEmail,
            ItemName: this.state.request,
            ItemDescription: this.state.description            
          }
        })
        .then(res => {
            console.log(res.data);
            let channel = pusher.subscribe(`cook-${this.props.email}`);
            channel.bind('new-order', function (data) {
            const audio = new Audio(notificationSound);
            audio.play();
            openModal(ModalKey.NEW_ORDER, {...data});
            });
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
                            className="submit-button"
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


