import React, { Component } from 'react';
import ImageOfCook from '../../constants/images/full_white_logo.png';
import { Row, Col, Container, Button, ListGroup, FormControl, FormLabel, Image, Form } from "react-bootstrap";
import axios from 'axios';
import { serverURL } from '../../config';
import BagItem from '../Common/Bag/BagItem';
import PaypalExpressBtn from 'react-paypal-express-checkout';
import { withRouter } from 'react-router-dom';

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
        console.log("The payment was succeeded!", payment);
        this.placeOrder();
    }

    placeOrder = () => {
        const { baggedItems, email } = this.props;
        const { instructions, street, city, state, zipcode, subtotal } = this.state;

        let orderedBag = [];
        for(let i = 0; i < baggedItems.length; i++) {
            orderedBag.push({
                foodId: baggedItems[i].food_id,
                quantity: baggedItems[i].quantity,
                price: baggedItems[i].quantity * baggedItems[i].price
            });
        }

        const data = {
            cookEmail: baggedItems[0].email,
            customerEmail: email,
            instructions: instructions,
            deliveryTime: 30,
            orderStatus: 'placed',
            orderAddress: `${street}, ${city}, ${state} - ${zipcode}`,
            itemList: orderedBag
        };

        axios.post(`${serverURL}/placeorder`, {data: data})
            .then(res => {
                console.log(res.data)
            })
    }

    onCancel = (data) => {
        console.log('The payment was cancelled!', data);
    }

    onError = (err) => {
        console.log("Error!", err);
    }

    render() {
        let env = 'sandbox';
        let currency = 'USD';
        const client = {
            sandbox: 'AQz8o-Lc6iEClKWllJjLUo0qT7Sd-ORu0rD-fBiaYNvfErmTm5xM6aAJ2EBSFVaXAC9iVct84qgtDURC',
            production: 'YOUR-PRODUCTION-APP-ID',
        }
        const { baggedItems } = this.props;
        const { subtotal, fees, total } = this.state;

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
                    <PaypalExpressBtn
                        className="paypal-button"
                        env={env}
                        client={client}
                        currency={currency}
                        total={total}
                        onError={this.onError}
                        onSuccess={this.onSuccess}
                        onCancel={this.onCancel}
                        style={style}
                    />
                    <Button onClick={this.placeOrder}>Random</Button>
                </div>
                <div className="delivery-container">
                    <div className="address-div">
                        <h4>Address</h4>
                        <Form>
                            <div className="input-row">
                                <Form.Group className="address-inputs" controlId="street">
                                    <Form.Label>Street address</Form.Label>
                                    <Form.Control type="text" placeholder="Address Line 1" />
                                </Form.Group>
                                <Form.Group className="address-inputs" controlId="city">
                                    <Form.Label>City</Form.Label>
                                    <Form.Control type="text" placeholder="City" />
                                </Form.Group>
                            </div>
                            <div className="input-row">
                                <Form.Group className="address-inputs" controlId="state">
                                    <Form.Label>State</Form.Label>
                                    <Form.Control type="text" placeholder="State" />
                                </Form.Group>
                                <Form.Group className="address-inputs" controlId="zipcode">
                                    <Form.Label>Zipcode</Form.Label>
                                    <Form.Control type="number" placeholder="Zipcode" />
                                </Form.Group>
                            </div>
                        </Form>
                    </div>
                    <div className="address-div">
                        
                        <Form>
                            <Form.Group controlId="instructions">
                                <Form.Label>Delivery Instructions</Form.Label>
                                <Form.Control as="textarea" type="text" placeholder="Delivery instructions..." />
                            </Form.Group>
                        </Form>
                    </div>
                </div>
            </div>
        );
    }

}
export default withRouter(Checkout);