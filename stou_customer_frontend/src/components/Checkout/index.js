import React, { Component } from 'react';
import ImageOfCook from '../../constants/images/full_white_logo.png';
import { Row, Col, Container, Button, ListGroup, FormControl, FormLabel, Image, Form } from "react-bootstrap";
import axios from 'axios';
import { serverURL, pusher } from '../../config';
import BagItem from '../Common/Bag/BagItem';
import PaypalExpressBtn from 'react-paypal-express-checkout';
import { withRouter } from 'react-router-dom';
import { ModalKey } from '../../constants/ModalKeys';
import notificationSound from '../../constants/sounds/notification.mp3';

const CLIENT = {
    sandbox: 'AQz8o-Lc6iEClKWllJjLUo0qT7Sd-ORu0rD-fBiaYNvfErmTm5xM6aAJ2EBSFVaXAC9iVct84qgtDURC',
    production: 'xxxXXX',
};
const style = {
    size: 'large',
    color: 'gold',
    shape: 'rect',
    label: 'checkout',
    tagline: 'true'
};

class Checkout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            subtotal: 0,
            fees: 0,
            total: 0,
            street: '',
            city: '',
            state: '',
            zipcode: '',
            instructions: '',
        };
    }

    async componentDidMount() {
        const { refresh, auth_token, email } = this.props;

        if(!auth_token || auth_token === '') {
            this.props.history.push('/login');
        }

        await refresh();
        const subtotal = this.getSubtotal();
        this.setState({
            subtotal: subtotal,
            fees: (subtotal * 0.15).toFixed(2),
            total: (subtotal * 1.15).toFixed(2),
        });
    }

    handleChange = e => {
        this.setState({
            [e.target.id]: e.target.value
        });
    }

    getSubtotal = () => {
        const { baggedItems } = this.props;
        console.log("CHECK ME OUT");
        console.log(baggedItems)
        let sum = 0;
        for (let i = 0; i < baggedItems.length; i++) {
            sum += baggedItems[i].price * baggedItems[i].quantity;
        }
        return sum;
    }

    onSuccess = (payment) => {
        //console.log("The payment was succeeded!", payment);
        this.placeOrder(payment.paymentID);
    }

    placeOrder = (paymentID) => {
        console.log(paymentID)
        const { baggedItems, email, openModal } = this.props;
        const { instructions, street, city, state, zipcode, subtotal } = this.state;
        console.log(this.state)
        const data = {
            cookEmail: baggedItems[0].email,
            customerEmail: email,
            instructions: instructions,
            deliveryTime: 30,
            orderStatus: 'placed',
            orderAddress: `${street}, ${city}, ${state} - ${zipcode}`,
            itemList: baggedItems,
            paymentID: paymentID
        };

        axios.post(`${serverURL}/placeorder`, {data: data})
            .then(res => {
                const orderId = res.data.orderId;
                let channel = pusher.subscribe(`cook-${orderId}`);
					channel.bind('order-update', function (data) {
						const audio = new Audio(notificationSound);
                        audio.play();
                        console.log(data)
						openModal(ModalKey.ORDER_UPDATE, {...data});
					});
            })
    }

    onCancel = (data) => {
        console.log('The payment was cancelled!', data);
    }

    onError = (err) => {
        console.log("Error!", err);
    }
    handleChange =(e,name) => {
        console.log(name)
        if(name === "street") {
            this.setState({street: e.target.value});
        }else if(name === "city") {
            this.setState({city: e.target.value});
        }else if(name === "state") {
            this.setState({state: e.target.value});
        }else if(name === "zipcode") {
            this.setState({zipcode: e.target.value});
        }
    }
    validate = (street, city, state, zipcode) => {
        if(street.length === 0) {
            return "hidden"
        }else if(street.length === 0){
            return "hidden" 
        }else if(street.length === 0) {
            return "hidden"
        }else if(zipcode.length === 0) {
            return "hidden"
        }
        return ""
        
    }

    render() {
        let env = 'sandbox';
        let currency = 'USD';
        const client = {
            sandbox: 'AQz8o-Lc6iEClKWllJjLUo0qT7Sd-ORu0rD-fBiaYNvfErmTm5xM6aAJ2EBSFVaXAC9iVct84qgtDURC',
            production: 'YOUR-PRODUCTION-APP-ID',
        }
        const { baggedItems } = this.props;
        const { instructions, street, city, state, zipcode, subtotal, fees, total } = this.state;
        return (
            <div className="checkout-container">
                <div className="checkout-items">
                    <ListGroup className="checkout-items-list">
                        <ListGroup.Item>
                            <b>Your Order</b>
                        </ListGroup.Item>
                        {baggedItems.map(item =>
                            <ListGroup.Item className="bag-item-container">
                                <p className="bag-item-quantity">{item.quantity}</p>
                                <p className="bag-item-name">{item.name}</p>
                                <p className="bag-item-price">${item.quantity * item.price}</p>
                            </ListGroup.Item>
                        )}
                        <ListGroup.Item>
                            <div className="bag-item-container">
                                <p className="bag-item-name">Subtotal:</p>
                                <p className="bag-item-price">${subtotal}</p>
                            </div>
                            <div className="bag-item-container">
                                <p className="bag-item-name">Fees and charges:</p>
                                <p className="bag-item-price">${fees}</p>
                            </div>
                            <div className="bag-item-container">
                                <p className="bag-item-name"><b>Total:</b></p>
                                <p className="bag-item-price">${total}</p>
                            </div>
                        </ListGroup.Item>
                    </ListGroup>
                    <div className="paypal-button-div" style={{visibility: this.validate(this.state.state,this.state.city,this.state.state,this.state.zipcode)}}>
                    <PaypalExpressBtn
                        // className="paypal-button"
                        env={env}
                        client={client}
                        currency={currency}
                        total={total}
                        onError={this.onError}
                        onSuccess={this.onSuccess}
                        onCancel={this.onCancel}
                        style={{layout: "vertical", shape: "rect", size: "large"}}
                    />
                    </div>
                    <Button onClick={this.placeOrder}>Random</Button>
                </div>
                <div className="delivery-container">
                    <div className="address-div">
                        <h4>Address</h4>
                        <Form>
                            <div className="input-row">
                                <Form.Group className="address-inputs" controlId="street">
                                    <Form.Label>Street address</Form.Label>
                                    <Form.Control type="text" placeholder="Address Line 1" value={street} onChange={(e) => this.handleChange(e, "street")} />
                                </Form.Group>
                                <Form.Group className="address-inputs" controlId="city">
                                    <Form.Label>City</Form.Label>
                                    <Form.Control type="text" placeholder="City" value={city} onChange={(e) => this.handleChange(e, "city")} />
                                </Form.Group>
                            </div>
                            <div className="input-row">
                                <Form.Group className="address-inputs" controlId="state">
                                    <Form.Label>State</Form.Label>
                                    <Form.Control type="text" placeholder="State" value={state} onChange={(e) => this.handleChange(e, "state")}/>
                                </Form.Group>
                                <Form.Group className="address-inputs" controlId="zipcode">
                                    <Form.Label>Zipcode</Form.Label>
                                    <Form.Control type="number" placeholder="Zipcode" value={zipcode} onChange={(e) => this.handleChange(e, "zipcode")} />
                                </Form.Group>
                            </div>
                        </Form>
                    </div>
                    <div className="address-div">
                        
                        <Form>
                            <Form.Group controlId="instructions">
                                <Form.Label>Delivery Instructions</Form.Label>
                                <Form.Control as="textarea" type="text" placeholder="Delivery instructions..." value={instructions} onChange={this.handleChange} />
                            </Form.Group>
                        </Form>
                    </div>
                </div>
            </div>
        );
    }

}
export default withRouter(Checkout);