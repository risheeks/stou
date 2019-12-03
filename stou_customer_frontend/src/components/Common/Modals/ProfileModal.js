import React, { Component } from "react";
import { Modal, Button, Collapse} from "react-bootstrap";
import { Row, Col, Container, FormGroup, FormControl, FormLabel, Image, ListGroup, Form } from "react-bootstrap";
import CustomRating from '../../Common/CustomRating';
import Accordion from 'react-bootstrap/Accordion'
import { useState } from 'react';
import axios from 'axios';
import { serverURL } from '../../../config';

class ProfileModal extends Component {
    
    constructor(props) {
      super(props);
      this.state = {
        open:false,
        reviewRating:[]
      };
    }
    componentDidMount() {
        this.getReviewRating();
    }
    setOpen = (open) => {
        this.setState({open:open})
        console.log(this.state.reviewRating[1])
    }

    getReviewRating = () => {
        axios.post(`${serverURL}/getreviewrating`, {
            data: {
              email: this.props.cook_email,
              role: 1
            }
        })
        .then(res => {
            this.setState({
                reviewRating: Array.from(res.data.data[1])
            });
        })
    }

    render() {
        let { showModal, closeModal, description} = this.props;
        let {open} = this.state
        return (
            
            <Modal show={showModal} onHide={() => closeModal()}>
                <Modal.Header closeButton className="profile-footer-modal">
                <Form.Label className='text-profile-modal'><h1 className='text-profile-name-modal'>HomeCook</h1></Form.Label>
                </Modal.Header>
                <Modal.Body>
                <Row>
                    <Col xs="4">
                        <Image className="image-upload-preview-modal" src={this.props.picture} fluid thumbnail roundedCircle />
                    </Col>
                    <Col>
                    <Form.Label className='text-profile-modal'><h1 className='text-profile-name-modal'>{this.props.name}</h1></Form.Label>
                    <Form.Label><h3 className='text-profile-description-modal'>{this.props.description ? this.props.description : "I am pationate about cooking"}</h3></Form.Label>
                    </Col>
                </Row>
                </Modal.Body>
                <Modal.Footer className="profile-footer-modal">
                <div className="footer-review-top">
                    {/* <CustomRating rating="0" readonly={true} bowlSize="30px"/>  */}
                    <div className="footer-review">
                        <Button
                            className = "footer-review-button"
                            onClick={() => this.setOpen(!open)}
                            aria-controls="example-collapse-text"
                            aria-expanded={open}
                            >
                            Review
                        </Button>
                        
                        <div className="">
                       
                        {this.state.reviewRating.map(item => (
                            <Collapse in={open}>
                            <Container className="ViewFoodOptions">
                                <ListGroup>
                                <ListGroup.Item className="food-option-view-menu">
                                <div className="food-option-inner">
                                    <div className="review-info">
                                        <div className="reviewer-name">
                                            <Form.Label>
                                                <p>{item.customer}</p>
                                            </Form.Label>
                                        </div>
                                        <div className="vfo-description wrapped-review-text">
                                            <p>
                                                {item.review}
                                            </p>
                                        </div>
                                        <div className="review-bowl">
                                            <p><b><CustomRating rating={item.rating} readonly={true} bowlSize="20px"/></b></p>
                                        </div>
                                    </div>
                                </div>
                                </ListGroup.Item>
                                </ListGroup>
                            </Container>
                            </Collapse>
                        ))}
                        </div>
                    </div>
                </div>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default ProfileModal;