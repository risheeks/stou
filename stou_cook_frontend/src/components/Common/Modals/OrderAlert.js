import React, { Component } from 'react';
import { Modal, Button, Image, ListGroup } from 'react-bootstrap';
import NavLink from 'react-bootstrap/NavLink';
import axios from 'axios';
import { serverURL, tokenUrl, instanceLocator } from '../../../config';
import { ModalKey } from '../../../constants/ModalKeys';
import { ChatManager, TokenProvider } from '@pusher/chatkit-client'
import Raven from 'raven-js';

class OrderAlert extends Component {
    constructor(props) {
        super(props);
    }

    getSubtotal = () => {
        const { items } = this.props;
        let sum = 0;
        for (let i = 0; i < items.length; i++) {
            sum += items[i].price * items[i].quantity;
        }
        return sum;
    }

    componentDidMount() {
            const chatManager = new ChatManager({
                instanceLocator: instanceLocator,
                userId: this.props.order.cookEmail,
                tokenProvider: new TokenProvider({
                    url: tokenUrl,

                })
            })
            chatManager.connect()
                .then(currentUser => {
                    this.setState({ currentUser })
                    // this.getRooms()
                })
                .catch(err => console.log('error on connecting: ', err))
    }

    setOrderStatus = (orderStatus, order) => {
        const data = {
            orderStatus,
            orderId: order.orderId
        }
        if (orderStatus === "in_progress") {
            let { customerEmail, cookEmail } = "";
            customerEmail = order.customerEmail;
            cookEmail = order.cookEmail;
            this.state.currentUser.createRoom({
                id: customerEmail + "-" + cookEmail,
                name: customerEmail + "-" + cookEmail,
                private: true,
                addUserIds: [customerEmail, cookEmail]
            });
        }
        axios.post(`${serverURL}/setorderstatus`, { data })
            .then(res => {
                this.props.closeModal();
            })
            .catch(err => {
                Raven.captureException("SetOrderStatus: " + err);
            })
    }

    renderOrderInfo = order => {
        const orderTime = new Date(parseInt(order.orderedAt)).toLocaleString('en-US');
        return (
            <div>
                <div>Order placed at <b>{orderTime}</b></div>
                <div>Delivery to <b>{order.orderAddress}</b></div>
            </div>
        );
    }

    render() {
        const { showModal, closeModal, items, order } = this.props;

        return (
            <Modal show={showModal} onHide={() => closeModal()}>
                <Modal.Header closeButton>
                    <b>You have a new order!</b>
                </Modal.Header>
                <Modal.Body>
                    {this.renderOrderInfo(order)}
                    <ListGroup className="bag-itemlist-container">
                        <ListGroup.Item>
                            <b>Order items</b>
                        </ListGroup.Item>
                        {items.map(item =>
                            <ListGroup.Item className="bag-item-container">
                                <p className="bag-item-name">{item.name}</p>
                                <p className="bag-item-price">x {item.quantity}</p>
                            </ListGroup.Item>
                        )}
                        <ListGroup.Item className="bag-item-container">
                            <p className="bag-item-name"><b>Subtotal:</b></p>
                            <p className="bag-item-price">${this.getSubtotal()}</p>
                        </ListGroup.Item>
                    </ListGroup>
                </Modal.Body>
                <Modal.Footer>
                    <div className="order-item-button-div">
                        <Button className="margined-buttons" variant="danger" onClick={e => this.setOrderStatus("declined", order)}>Decline</Button>
                        <Button className="margined-buttons" variant="success" onClick={e => this.setOrderStatus("in_progress", order)}>Accept</Button>
                    </div>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default OrderAlert;