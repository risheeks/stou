import React, { Component } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { ROLE } from '../../../../constants';
import axios from 'axios';
import { serverURL } from '../../../../config';
import CustomRating from '../../CustomRating';

class Rate extends Component {
    constructor(props) {
        super(props);

        this.state = {
            review: '',
        }
    }

    handleChange = e => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    render() {
        return (
            <div>
                <p className="rate-orders-heading">Please rate your experience</p>
                <div className="rating-modal-div">
                    <CustomRating rating={0} readonly={false} bowlSize="50px" />
                </div>
                <Form.Group controlId="review" className="form-group">
                    <Form.Control as="textarea" value={this.state.review} type="text" onChange={this.handleChange} placeholder="Write your review..." />
                </Form.Group>
                <div className="rate-submit-div">
                    <Button className="rate-submit" variant="success">Submit</Button>
                </div>
            </div>
        );
    }
}

export default Rate;    