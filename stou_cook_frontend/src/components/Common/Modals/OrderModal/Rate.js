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
            rate: 0
        }
    }

    changeRating = e => {
        this.setState({
            rate: e
        })
    }

    sendRating = e => {
        axios.post(`${serverURL}/setreviewrating`, {
            data: {
                email: this.props.order.customerEmail,
                rating: this.state.rate,
                role: 2,
                orderId: this.props.order.orderId,
                review: this.state.review
            }
        })
            .then(res => {
                this.props.setOrders();
                this.props.closeModal();
            })

    }


    render() {
        return (
            <div>
                <p className="rate-orders-heading">Please rate your experience</p>
                <div className="rating-modal-div">
                    <CustomRating rating={this.state.rate} readonly={false} bowlSize="50px" changeRating={this.changeRating} />
                </div>
                <div className="rate-submit-div">
                    <Button className="rate-submit" variant="success" onClick={this.sendRating}>Submit</Button>
                </div>
            </div>
        );
    }
}

export default Rate;    