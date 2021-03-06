import React, { Component } from 'react';
import { Modal, Button, Image, ListGroup } from 'react-bootstrap';
import OrderProgress from './OrderProgress';
import axios from 'axios';
import { serverURL } from '../../../../config';
import Rate from './Rate';
import Raven from 'raven-js';


class OrderModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            items: []
        };
    }

    componentDidMount() {
        const { order } = this.props;
        const data = {
            orderId: order.orderId
        }
        axios.post(`${serverURL}/getfooditemsbyorder`, { data })
            .then(res => {
                this.setState({
                    items: Array.from(res.data)
                });
            }).catch(err => {
                Raven.captureException("GetFoodItemsByOrder: " + err);
            })
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
                <div>Order from <b>{order.name}</b></div>
                <div>Order placed at <b>{orderTime}</b></div>
            </div>
        );
    }

    render() {
        const { showModal, closeModal, order, setOrders } = this.props;
        const { items } = this.state;
        console.log(order.rating)
        return (
            <Modal show={showModal} onHide={() => closeModal()}>
                <Modal.Header closeButton>
                    <b>Order details</b>
                </Modal.Header>
                <Modal.Body>
                    {this.renderOrderInfo(order)}
                    <OrderProgress status={order.orderStatus} />
                    {order.orderStatus == 'delivered' && !order.rating ?
                        <Rate order={order} closeModal={closeModal} setOrders={setOrders}/> : null
                    }
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
            </Modal>
        );
    }
}

export default OrderModal;