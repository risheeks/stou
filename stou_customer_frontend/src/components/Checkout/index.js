import React, { Component } from 'react';
import ImageOfCook from '../../constants/images/full_white_logo.png';
import { Row, Col, Container, Button, ListGroup, FormControl, FormLabel, Image, Form } from "react-bootstrap";
import axios from 'axios';
import { serverURL, pusher } from '../../config';
import BagItem from '../Common/Bag/BagItem';
import { withRouter } from 'react-router-dom';
import { ModalKey } from '../../constants/ModalKeys';
import { tokenUrl, instanceLocator } from '../../config'
import { ChatManager, TokenProvider } from '@pusher/chatkit-client'
import { PayPalButton } from "react-paypal-button-v2";
import Raven from 'raven-js';

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
            origTotal: 0,
            discount: 0,
            isApplied: false,
            street: '',
            city: '',
            state: '',
            zipcode: '',
            instructions: '',
            time: 0,
            isOn: false,
            start: 0,
            promo_code: '',
            promo_code_success: ''
        };
        this.startTimer = this.startTimer.bind(this)
        this.stopTimer = this.stopTimer.bind(this)
        this.resetTimer = this.resetTimer.bind(this)
    }
    startTimer() {
        this.setState({
            isOn: true,
            time: this.state.time,
            start: Date.now() - this.state.time
        })
        this.timer = setInterval(() => this.setState({
            time: Date.now() - this.state.start
        }), 300000);
    }
    stopTimer() {
        this.setState({ isOn: false })
        clearInterval(this.timer)
    }
    resetTimer() {
        this.setState({ time: 0, isOn: false })
    }

    async componentDidMount() {
        console.log(this.props.location)
        this.startTimer()
        const { refresh, auth_token, email } = this.props;

        if (!auth_token || auth_token === '') {
            this.props.history.push('/login');
        }
        // const chatManager = new ChatManager({
        //     instanceLocator: instanceLocator,
        //     userId: this.props.email,
        //     tokenProvider: new TokenProvider({
        //         url: tokenUrl,

        //     })
        // })
        // chatManager.connect()
        // .then(currentUser => {
        //     this.setState({currentUser})
        //     this.getRooms()
        // })
        // .catch(err => console.log('error on connecting: ', err))

        await refresh();
        const subtotal = this.getSubtotal();
        this.setState({
            subtotal: subtotal,
            fees: (subtotal * 0.15).toFixed(2),
            total: (subtotal * 1.15).toFixed(2),
            origTotal: (subtotal * 1.15).toFixed(2)
        });
    }

    componentDidUpdate = (prevProps, prevState) => {
        const { clearOrder } = this.props;
        if (prevState.time !== this.state.time && this.state.time) {
            clearOrder();
            this.props.history.push('/orders');
            // const chatManager = new ChatManager({
            //     instanceLocator: instanceLocator,
            //     userId: this.props.email,
            //     tokenProvider: new TokenProvider({
            //         url: tokenUrl,

            //     })
            // })
            // chatManager.connect()
            // .then(currentUser => {
            //     this.setState({currentUser})
            //     this.getRooms()
            // })
            // .catch(err => console.log('error on connecting: ', err))
        }
    }
    handleChange = e => {
        this.setState({
            [e.target.id]: e.target.value
        });
    }

    getSubtotal = () => {
        const { baggedItems, zipcode } = this.props;
        console.log("CHECK ME OUT");
        console.log(baggedItems)
        console.log(zipcode);
        let sum = 0;
        for (let i = 0; i < baggedItems.length; i++) {
            sum += baggedItems[i].price * baggedItems[i].quantity;
        }
        return sum;
    }

    onSuccess = (payment) => {
        //console.log("The payment was succeeded!", payment);
        const { clearOrder } = this.props;
        this.placeOrder(payment.paymentID);
        clearOrder();
        this.props.history.push('/');
    }
    onTest = (e) => {
        this.placeOrder(Date.now());
        const { clearOrder } = this.props;
        clearOrder();
        this.props.history.push('/');
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

        axios.post(`${serverURL}/placeorder`, { data: data })
            .then(res => {
                console.log(email + "-" + baggedItems[0].email)
                if(this.state.isApplied) {
                    axios.post(`${serverURL}/usepromocode`, {
                        data: {
                            promoCode:this.state.promo_code_success,
                            status:1
                        }
                    })
                    .then(res => {
                        console.log(res.data.code);
                    })
                    .catch(err => {
                        Raven.captureException("UsePromoCode: " + err);
                    })
                }

            })
            .catch(err => {
                Raven.captureException("PlaceOrder: " + err);
            })
    }

    onCancel = (data) => {
        console.log('The payment was cancelled!', data);
    }

    onError = (err) => {
        console.log("Error!", err);
    }
    handleChange = (e, name) => {
        console.log(name)
        if (name === "street") {
            this.setState({ street: e.target.value });
        } else if (name === "city") {
            this.setState({ city: e.target.value });
        } else if (name === "state") {
            this.setState({ state: e.target.value });
        } else if (name === "zipcode") {
            if (parseInt(name) != this.props.location) {
            }
            this.setState({ zipcode: e.target.value });
        } else if (name === "instructions") {
            this.setState({ instructions: e.target.value });
        } else if (name === "promo-code") {
            this.setState({ promo_code: e.target.value });
        }
    }
    validate = (street, city, state, zipcode) => {
        if (street.length === 0) {
            return false
        } else if (city.length === 0) {
            return false
        } else if (state.length === 0) {
            return false
        } else if (parseInt(zipcode) !== parseInt(this.props.zipcode)) {
            return false
        }
        return true

    }
    applyDiscount = (e) => {
        //TODO: Server call for promo_code
        let { promo_code, origTotal, total, isApplied } = this.state;
     
        if (promo_code == '' || !promo_code) {
            this.setState({ total: origTotal });
            this.setState({ discount: 0 });
            this.setState({ isApplied: false });
            return;
        }
        axios.post(`${serverURL}/checkpromocode`, {
            data: {
                promoCode:promo_code,
            }
        })
        .then(res => {
            console.log(res.data.code);
            if(res.data.code === 200) {
                console.log(promo_code)
                if (!isApplied) {
                    this.setState({ discount: "-" + (total / 10).toFixed(2) });
                    let newTotal = (total - total / 10).toFixed(2);
                    this.setState({ total: newTotal });
                    this.setState({ isApplied: true });
                    this.setState({promo_code_success:promo_code})
                }
            }
        })
        .catch(err => {
            Raven.captureException("CheckPromoCode: " + err);
        })
        
    }

    onSuccessPaypal = () => {

    }

    render() {
        //console.log(this.state.time)
        let env = 'sandbox';
        let currency = 'USD';
        const client = {
            sandbox: 'AQz8o-Lc6iEClKWllJjLUo0qT7Sd-ORu0rD-fBiaYNvfErmTm5xM6aAJ2EBSFVaXAC9iVct84qgtDURC',
            production: 'YOUR-PRODUCTION-APP-ID',
        }
        const { baggedItems, clearOrder } = this.props;
        const { instructions, street, city, state, zipcode, subtotal, fees, total, discount, promo_code } = this.state;

        return (
            <div className="master-container">
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
                                    <p className="bag-item-name">Discount:</p>
                                    <p className="bag-item-price"><b>${discount}</b></p>
                                </div>

                                <div className="bag-item-container">
                                    <p className="bag-item-name"><b>Total:</b></p>
                                    <p className="bag-item-price">${total}</p>
                                </div>
                            </ListGroup.Item>
                        </ListGroup>
                        <br/>
                        {this.validate(this.state.street, this.state.city, this.state.state, this.state.zipcode) ?
                        <div className="paypal-button-div">
                            <PayPalButton
                            
                            className="paypal-button"
                            amount={total}
                            onSuccess={(details, data) =>  {
                                alert("Transaction completed by " + details.payer.name.given_name);
                                const { clearOrder } = this.props;
                                this.placeOrder(data.orderID);
                                clearOrder();
                                this.props.history.push('/');
                                console.log(data.orderID)
                                return fetch("/paypal-transaction-complete", {
                                    method: "post",
                                    body: JSON.stringify({
                                        orderID: data.orderID
                                    })
                                });
                            }}
                            options={{
                                clientId: "AQz8o-Lc6iEClKWllJjLUo0qT7Sd-ORu0rD-fBiaYNvfErmTm5xM6aAJ2EBSFVaXAC9iVct84qgtDURC"
                            }}
                            />
                        </div> : null}
                        <Button variant="primary" onClick={this.onTest}>Checkout</Button>
                        
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
                                        <Form.Control type="text" placeholder="State" value={state} onChange={(e) => this.handleChange(e, "state")} />
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
                                    <Form.Control as="textarea" type="text" placeholder="Delivery instructions..." value={instructions} onChange={(e) => this.handleChange(e, "instructions")} />
                                </Form.Group>
                            </Form>
                        </div>
                        {/* <div className="input-row"> */}
                        <Form>
                            <Form.Group className="promo-code" controlId="promo-code">
                                <Form.Label>Promo-code:</Form.Label>
                                <Row>
                                    <Col>
                                        <Form.Control type="text" placeholder="Enter code" value={promo_code} onChange={(e) => this.handleChange(e, "promo-code")} />
                                    </Col>
                                    <Col>
                                        <Button variant="primary" onClick={(e) => this.applyDiscount(e)}>Enter</Button>
                                        
                                    </Col>
                                </Row>
                            </Form.Group>
                        </Form>
                        {/* </div> */}
                    </div>
                </div>
            </div>
        );
    }

}
export default withRouter(Checkout);