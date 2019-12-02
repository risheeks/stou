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
            rate:0
        }
    }

    handleChange = e => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    changeRating = e => {
        this.setState({
            rate: e
        })
    }

    sendRating = e => {
        //console.log(this.props.order.orderId + " " + this.state.rate + " " + this.props.order.cookEmail + " " + this.state.review)
        //return
        axios.post(`${serverURL}/setreviewrating`, {
            data: {
              email: this.props.order.cookEmail,
              rating: this.state.rate,
              role: 1,
              orderId: this.props.order.orderId,
              review: this.state.review
            }
          })
          .then(res => {
            console.log(res.data);
        })
        
    }
    

    render() {
        return (
            <div>
                <p className="rate-orders-heading">Please rate your experience</p>
                <div className="rating-modal-div">
                    <CustomRating rating={this.state.rate} readonly={false} bowlSize="50px" changeRating ={this.changeRating}/>
                </div>
                <Form.Group controlId="review" className="form-group">
                    <Form.Control as="textarea" value={this.state.review} type="text" onChange={this.handleChange} placeholder="Write your review..." />
                </Form.Group>
                <div className="rate-submit-div">
                    <Button className="rate-submit" variant="success" onClick={this.sendRating}>Submit</Button>
                </div>
            </div>
        );
    }
}

export default Rate;    