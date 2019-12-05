import React, { Component } from 'react';
import { ToggleButtonGroup, ToggleButton, ListGroup, Button } from 'react-bootstrap';
import axios from 'axios';
import { serverURL } from '../../config';
import { ModalKey } from '../../constants/ModalKeys';
import { tokenUrl, instanceLocator } from '../../config';
import { ChatManager, TokenProvider } from '@pusher/chatkit-client';

class Orders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orders_type: "placed",
            orders: []
        }
    }

    componentDidMount() {
        this.setOrders();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.orders_type !== this.state.orders_type || prevProps.email !== this.props.email) {
            this.setOrders();
            const chatManager = new ChatManager({
                instanceLocator: instanceLocator,
                userId: this.props.email,
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

    setOrders = () => {
        const { orders_type } = this.state;
        const data = {
            cookEmail: this.props.email,
            status: orders_type
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

    handleChange = val => {
        this.setState({
            orders_type: val,
            orders: []
        });
    }

    handleOrder = (e, order) => {
        this.props.openModal(ModalKey.ORDER_STATUS, { order, setOrders: this.setOrders });
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
                order.orderStatus = orderStatus
                this.props.openModal(ModalKey.ORDER_STATUS, { order, setOrders: this.setOrders });
                this.setOrders();
            })
            .catch(err => {
                if(err.response) {
                    console.log(err.response.data);
                }
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
                            <Button className="margined-buttons" variant="danger" onClick={e => this.setOrderStatus("cancelled", order)}>Cancel</Button>
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
                            <Button className="margined-buttons" variant="danger" onClick={e => this.setOrderStatus("cancelled", order)}>Cancel</Button>
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

    renderRequestCancel = () => {
        const { orders } = this.state;
        return (
            <ListGroup className="orders-list" >
                {orders.map(order =>
                    <ListGroup.Item className="order-item-div">
                        {this.renderOrderInfo(order)}
                        <div className="order-item-button-div">
                            <Button className="margined-buttons" variant="danger" onClick={e => this.setOrderStatus("in_progress", order)}>Decline</Button>
                            <Button className="margined-buttons" variant="success" onClick={e => this.setOrderStatus("cancelled", order)}>Accept</Button>
                        </div>
                    </ListGroup.Item>
                )}
            </ListGroup>
        );
    }

    renderOrders = () => {
        const { orders_type } = this.state;
        switch (orders_type) {
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
        const { orders_type } = this.state;

        return (
            <div className="orders-container">
                <div className="orders-type-tabs">
                    <ToggleButtonGroup className="multi-checkbox-div" name="orders_type" type="radio" value={orders_type} onChange={this.handleChange}>
                        <ToggleButton className="single-checkbox" value="delivered">Past Orders</ToggleButton>
                        <ToggleButton className="single-checkbox" value="placed">New Orders</ToggleButton>
                        <ToggleButton className="single-checkbox" value="in_progress">In Progress</ToggleButton>
                        <ToggleButton className="single-checkbox" value="on_the_way">On The Way</ToggleButton>
                        <ToggleButton className="single-checkbox" value="request_cancel">Requested Cancellation</ToggleButton>
                    </ToggleButtonGroup>
                </div>
                {this.renderOrders()}
            </div>
        );
    }
}

export default Orders;