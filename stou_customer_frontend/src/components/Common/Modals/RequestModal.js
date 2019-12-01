import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap";
import { Row, Col, Container, FormGroup, FormControl, FormLabel, Image, ListGroup, Form } from "react-bootstrap";

 class RequestModal extends Component {
    constructor(props) {
      super(props);
      this.state = {
        requests: '',
        description: ''
      };
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
                            onClick={this.handleSubmit}
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


