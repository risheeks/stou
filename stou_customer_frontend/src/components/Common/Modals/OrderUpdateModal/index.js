import React, { Component } from 'react';
import { Modal, Button, Image, ListGroup } from 'react-bootstrap';
import OrderProgress from './OrderProgress';
import axios from 'axios';
import { serverURL } from '../../../../config';
import Rate from '../OrderModal/Rate';
import Raven from 'raven-js';


class OrderUpdateModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            items: [],
            order: {}
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
        axios.post(`${serverURL}/getdetailsbyorder`, { data })
        .then(res => {
            this.setState({
                order: res.data.data
            })
        }).catch(err => {
            Raven.captureException("GetDetailsByOrder: " + err);
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
                <div>Order from <b>{order.cookName}</b></div>
                <div>Order placed at <b>{orderTime}</b></div>
            </div>
        );
    }

    render() {
        const { showModal, closeModal, setOrders } = this.props;
        const propsOrder = this.props.order;
        const { items, order } = this.state;

        return (
            <Modal show={showModal} onHide={() => closeModal()}>
                <Modal.Header closeButton>
                    <b>Your order status was updated!</b>
                </Modal.Header>
                <Modal.Body>
                    {this.renderOrderInfo(order)}
                    <OrderProgress status={propsOrder.orderStatus} />
                    {order.orderStatus == 'delivered' && !order.rating ?
                        <Rate order={propsOrder} closeModal={closeModal} setOrders={setOrders}/> : null
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

export default OrderUpdateModal;