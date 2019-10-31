import React, { Component } from 'react';
import { ToggleButtonGroup, ToggleButton, ListGroup, Button } from 'react-bootstrap';
import axios from 'axios';
import { serverURL } from '../../config';
import { ModalKey } from '../../constants/ModalKeys';

class Orders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orders: []
        }
    }

    componentDidMount() {
        this.setOrders();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.email !== this.props.email) {
            this.setOrders();
        }
    }

    setOrders = orders_type => {
        const data = {
            cookEmail: this.props.email,
            status: 'all'
        }
        axios.post(`${serverURL}/getallorders`, { data })
            .then(res => {
                this.setState({
                    orders: Array.from(res.data)
                });
            })
            .catch(err => {
                this.setState({
                    orders: []
                });
            })
    }

    handleOrder = (e, order) => {
        this.props.openModal(ModalKey.ORDER_STATUS, { order });
    }

    setOrderStatus = (orderStatus, order) => {
        const data = {
            orderStatus,
            orderId: order.orderId
        }
        axios.post(`${serverURL}/setorderstatus`, { data })
            .then(res => {
                order.orderStatus = orderStatus
                this.props.openModal(ModalKey.ORDER_STATUS, {order});
            })
    }

    renderOrderInfo = order => {
        const orderTime = new Date(parseInt(order.orderedAt)).toLocaleString('en-US');
        return (
            <div>
                <Button className="order-item-info" variant="link" onClick={e => this.handleOrder(e, order)}>
                    <div>Order for <b>{order.name}</b></div>
                    <div>Order placed at <b>{orderTime}</b></div>
                </Button>
            </div>
        );
    }

    renderInProgress = () => {
        const { orders } = this.state;
        return (
            <ListGroup className="orders-list" >
                {orders.map(order =>
                    <ListGroup.Item className="order-item-div">
                        {this.renderOrderInfo(order)}
                        <div className="order-item-button-div">
                            <Button className="margined-buttons" variant="success" onClick={e => this.setOrderStatus("on_the_way", order)}>Mark on the way</Button>
                        </div>
                    </ListGroup.Item>
                )}
            </ListGroup>
        );
    }

    renderOnTheWay = () => {
        const { orders } = this.state;
        return (
            <ListGroup className="orders-list" >
                {orders.map(order =>
                    <ListGroup.Item className="order-item-div">
                        {this.renderOrderInfo(order)}
                        <div className="order-item-button-div">
                            <Button className="margined-buttons" variant="success" onClick={e => this.setOrderStatus("delivered", order)}>Mark delivered</Button>
                        </div>
                    </ListGroup.Item>
                )}
            </ListGroup>
        );
    }

    renderNew = () => {
        const { orders } = this.state;
        return (
            <ListGroup className="orders-list" >
                {orders.map(order =>
                    <ListGroup.Item className="order-item-div">
                        {this.renderOrderInfo(order)}
                        <div className="order-item-button-div">
                            <Button className="margined-buttons" variant="danger" onClick={e => this.setOrderStatus("declined", order)}>Decline</Button>
                            <Button className="margined-buttons" variant="success" onClick={e => this.setOrderStatus("in_progress", order)}>Accept</Button>
                        </div>
                    </ListGroup.Item>
                )}
            </ListGroup>
        );
    }

    renderPast = () => {
        const { orders } = this.state;
        return (
            <ListGroup className="orders-list" >
                {orders.map(order =>
                    <ListGroup.Item className="order-item-div" onClick={e => this.handleOrder(e, order)}>
                        {this.renderOrderInfo(order)}
                    </ListGroup.Item>
                )}
            </ListGroup>
        );
    }

    render() {
        const { orders_type } = this.state;

        return (
            <div className="orders-container">
                {this.renderOrders()}
            </div>
        );
    }
}

export default Orders;