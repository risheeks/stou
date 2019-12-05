import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap";
import { Row, Col, Container, FormGroup, FormControl, FormLabel, Image, ListGroup, Form } from "react-bootstrap";
import axios from 'axios';
import { serverURL } from '../../../config';
import { pusher } from '../../../config';
import { ModalKey } from "../../../constants/ModalKeys";
import notificationSound from '../../../constants/sounds/notification.mp3';
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

    componentDidMount() {
        this.getRequests();
    }

    getRequests = () => {
    const { openModal} = this.props;
    
    axios.post(`${serverURL}/getrequest`, {
        data: {
            email: this.props.email,
            role: 1            
        }
    })
    .then(res => {
        if (res.data.data.length > 0) {
            this.setState({
                requests: Array.from(res.data.data)
            });

        }
        else{
    
        }
    })
    }


    acceptRequest (email, name, e) {
        e.preventDefault();
        axios.post(`${serverURL}/changerequeststatus`, {
            data: {
                cookEmail: this.props.email,
                customerEmail: email,
                itemName: name,
                status: 1            
            }
        })
        .then(res => {
            
        })
    }

    rejectRequest (email, name, e) {
        //console.log(request);
        e.preventDefault();
        axios.post(`${serverURL}/changerequeststatus`, {
            data: {
                cookEmail: this.props.email,
                customerEmail: email,
                itemName: name,
                status: 2            
            }
        })
        .then(res => {
            
        })   
    }

    render() {
        let { showModal, closeModal, description, request_item} = this.props; 
     
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


