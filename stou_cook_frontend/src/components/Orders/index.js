import React, { Component } from 'react';
import { ToggleButtonGroup, ToggleButton, ListGroup, Button } from 'react-bootstrap';
import axios from 'axios';
import { serverURL } from '../../config';
import { ModalKey } from '../../constants/ModalKeys';

class Orders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orders_type: "placed",
            orders: []
        }
    }

    componentDidMount() {
        const { orders_type } = this.state;
        this.setOrders(orders_type);
    }

    componentDidUpdate(prevState) {
        if (prevState.orders_type === this.state.orders_type) {
            return;
        }
        const { orders_type } = this.state;
        this.setOrders(orders_type);
    }

    setOrders = orders_type => {
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
        console.log(val);
        this.setState({
            orders_type: val,
            orders: []
        });
    }

    handleOrder = (e, order) => {
        this.props.openModal(ModalKey.ORDER_STATUS, {order});
    }

    renderInProgress = () => {
        const { orders } = this.state;
        return (
            <ListGroup className="orders-list">
                {orders.map(order =>
                    <ListGroup.Item>
                        
                    <hr></hr>
                        <div className="button-div">
                            <Button className="margined-buttons" variant="success">Order is on the way!</Button>
                        </div>
                    </ListGroup.Item>
                )}
            </ListGroup>
        );
    }

    renderOnTheWay = () => {
        const { orders } = this.state;
        return (
            <ListGroup className="orders-list">
                {orders.map(order =>
                    <ListGroup.Item>
                        HELLO THERE EVERYONE
                <hr></hr>
                        <div className="button-div">
                            <Button className="margined-buttons" variant="success">Mark as delivered!</Button>
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
                    <ListGroup.Item onClick={e => this.handleOrder(e, order)}>
                        HELLO THERE EVERYONE
                <hr></hr>
                        <div className="button-div">
                            <Button className="margined-buttons" variant="danger">Decline</Button>
                            <Button className="margined-buttons" variant="success">Accept</Button>
                        </div>
                    </ListGroup.Item>
                )}
            </ListGroup>
        );
    }

    renderPast = () => {
        const { orders } = this.state;
        return (
            <ListGroup className="orders-list">
                {orders.map(order =>
                    <ListGroup.Item>
                        HELLO THERE EVERYONE
            </ListGroup.Item>
                )}
            </ListGroup>
        );
    }

    renderOrders = () => {
        const { orders_type } = this.state;
        switch (orders_type) {
            case "past_orders": {
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
                        <ToggleButton className="single-checkbox" value="past_orders">Past Orders</ToggleButton>
                        <ToggleButton className="single-checkbox" value="placed">New Orders</ToggleButton>
                        <ToggleButton className="single-checkbox" value="in_progress">In Progress</ToggleButton>
                        <ToggleButton className="single-checkbox" value="on_the_way">On The Way</ToggleButton>
                    </ToggleButtonGroup>
                </div>
                {this.renderOrders()}
            </div>
        );
    }
}

export default Orders;