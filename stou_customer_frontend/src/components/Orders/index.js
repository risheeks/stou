import React, { Component } from 'react';
import { ToggleButtonGroup, ToggleButton, ListGroup, Button, Image } from 'react-bootstrap';
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

    setOrderStatus = (orderStatus, order) => {
        const data = {
            orderStatus: orderStatus,
            orderId: order.orderId
        }
        console.log(data);
        axios.post(`${serverURL}/setorderstatus`, { data })
            .then(res => {
                order.orderStatus = orderStatus
                this.props.openModal(ModalKey.ORDER_STATUS, { order, setOrders: this.setOrders });
            })
    }

    setOrders = orders_type => {
        const data = {
            customerEmail: this.props.email
        }
        axios.post(`${serverURL}/getcustomerorders`, { data })
            .then(res => {
                console.log(res.data)
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
        this.props.openModal(ModalKey.ORDER_STATUS, { order, setOrders: this.setOrders });
    }

    renderOrderInfo = order => {
        const orderTime = new Date(parseInt(order.orderedAt)).toLocaleString('en-US');
        return (
            <div className="order-item-holder">
                <Image rounded className="order-item-image" src={order.picture} />
                <Button className="order-item-info" variant="link" onClick={e => this.handleOrder(e, order)}>
                    <div>Order from <b>{order.name}</b></div>
                    <div>Order placed at <b>{orderTime}</b></div>
                </Button>
            </div>
        );
    }

    renderOrders = () => {
        const { orders } = this.state;
        return (
            <ListGroup className="orders-list" >
                {orders.map(order =>
                    <ListGroup.Item className="order-item-div" action onClick={e => this.handleOrder(e, order)}>
                        {this.renderOrderInfo(order)}
                        <div className="order-item-button-div">
                            <p style={{paddingTop: '12px'}}>{order.orderStatus}</p>
                            {order.orderStatus === 'placed' || order.orderStatus === 'in_progress' ? <Button variant="danger" onClick={e => this.setOrderStatus("request_cancel", order)} style={{marginLeft: '20px'}}>Cancel</Button> : null}
                        </div>
                    </ListGroup.Item>
                )}
            </ListGroup>
        );
    }

    render() {
        const { orders_type } = this.state;

        return (
            <div className="master-container">
                <div className="orders-container">
                    <h3>Your Orders</h3>
                    {this.renderOrders()}
                </div>
            </div>
        );
    }
}

export default Orders;