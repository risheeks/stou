import React, { Component } from 'react';
import { Modal, Button, Image, ListGroup } from 'react-bootstrap';
import OrderProgress from './OrderProgress';
import axios from 'axios';
import { serverURL, tokenUrl, instanceLocator } from '../../../../config';
import { ModalKey } from '../../../../constants/ModalKeys';
import { ChatManager, TokenProvider } from '@pusher/chatkit-client';

class OrderModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            items: [],
            order: {}
        };
    }

    componentDidMount() {
        const { order } = this.props;
        this.setState({
            order: order
        })
        const data = {
            orderId: order.orderId
        }
        axios.post(`${serverURL}/getfooditemsbyorder`, { data })
            .then(res => {
                this.setState({
                    items: Array.from(res.data)
                });
            })
    }

    componentDidUpdate(prevProps) {
        if (prevProps.order !== this.props.order) {
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
    }

    getSubtotal = () => {
        const { items } = this.state;
        let sum = 0;
        for (let i = 0; i < items.length; i++) {
            sum += items[i].price * items[i].quantity;
        }
        return sum;
    }

    renderOrderInfo = order => {
        const orderTime = new Date(parseInt(order.orderedAt)).toLocaleString('en-US');
        return (
            <div>
                <div>Order for <b>{order.name}</b></div>
                <div>Order placed at <b>{orderTime}</b></div>
                <div>Deliver to <b>{order.orderAddress}</b></div>
            </div>
        );
    }

    setOrderStatus = (orderStatus, order) => {
        const data = {
            orderStatus,
            orderId: order.orderId
        }
        axios.post(`${serverURL}/setorderstatus`, { data })
            .then(res => {
                order.orderStatus = orderStatus
                this.setState({
                    order: order
                });
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
                    this.state.currentUser.addUserToRoom({
                        userId: customerEmail,
                        roomId: customerEmail + "-" + cookEmail
                    })
                    this.state.currentUser.addUserToRoom({
                        userId: cookEmail,
                        roomId: customerEmail + "-" + cookEmail
                    })
                }
                this.props.setOrders();
            })
    }

    renderInProgress = () => {
        const { order } = this.state;
        return (
            <Modal.Footer>
                <div className="order-item-button-div">
                    <Button className="margined-buttons" variant="success" onClick={e => this.setOrderStatus("on_the_way", order)}>Mark on the way</Button>
                </div>
            </Modal.Footer>
        );
    }

    renderOnTheWay = () => {
        const { order } = this.state;
        return (
            <Modal.Footer>
                <div className="order-item-button-div">
                    <Button className="margined-buttons" variant="success" onClick={e => this.setOrderStatus("delivered", order)}>Mark delivered</Button>
                </div>
            </Modal.Footer>
        );
    }

    renderNew = () => {
        const { order } = this.state;
        return (
            <Modal.Footer>
                <div className="order-item-button-div">
                    <Button className="margined-buttons" variant="danger" onClick={e => this.setOrderStatus("declined", order)}>Decline</Button>
                    <Button className="margined-buttons" variant="success" onClick={e => this.setOrderStatus("in_progress", order)}>Accept</Button>
                </div>
            </Modal.Footer>
        );
    }

    renderPast = () => {
        return (
            null
        );
    }

    renderRequestCancel = () => {
        const { order } = this.state;
        return (
            <Modal.Footer>
                <div className="order-item-button-div">
                    <Button className="margined-buttons" variant="danger" onClick={e => this.setOrderStatus("in_progress", order)}>Decline</Button>
                    <Button className="margined-buttons" variant="success" onClick={e => this.setOrderStatus("cancelled", order)}>Accept</Button>
                </div>
            </Modal.Footer>
        );
    }

    renderOrders = () => {
        const { order } = this.state;
        switch (order.orderStatus) {
            case "delivered": {
                return this.renderPast();
            }
            case "placed": {
                return this.renderNew();
            }
            case "in_progress": {
                return this.renderInProgress();
            }
            case "on_the_way": {
                return this.renderOnTheWay();
            }
            case "request_cancel": {
                return this.renderRequestCancel();
            }
            default: {
                return this.renderNew();
            }
        }
    }

    render() {
        const { showModal, closeModal } = this.props;
        const { items, order } = this.state;

        return (
            <Modal show={showModal} onHide={() => closeModal()}>
                <Modal.Header closeButton>
                    <b>{order.orderStatus === 'request_cancel' ? order.name + " is requesting order cancellation" : "Order details"}</b>
                </Modal.Header>
                <Modal.Body>
                    {this.renderOrderInfo(order)}
                    <OrderProgress status={order.orderStatus} />
                    <ListGroup className="bag-itemlist-container">
                        <ListGroup.Item>
                            <b>Order items</b>
                        </ListGroup.Item>
                        {items.map(item =>
                            <ListGroup.Item className="bag-item-container">
                                <p className="bag-item-name">{item.title}</p>
                                <p className="bag-item-price">x {item.quantity}</p>
                            </ListGroup.Item>
                        )}
                        <ListGroup.Item className="bag-item-container">
                            <p className="bag-item-name"><b>Subtotal:</b></p>
                            <p className="bag-item-price">${this.getSubtotal()}</p>
                        </ListGroup.Item>
                    </ListGroup>
                </Modal.Body>
                {this.renderOrders()}
            </Modal >
        );
    }
}

export default OrderModal;