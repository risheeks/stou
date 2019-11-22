import React, { Component } from 'react';
import { Row, Col, Container, Button, ListGroup, FormControl, FormLabel, Image } from "react-bootstrap";
import axios from 'axios';
import { serverURL } from '../../config';
import NavLink from 'react-bootstrap/NavLink';
import { ModalKey } from '../../constants/ModalKeys';
import defaultpicture from '../../constants/images/full_red_logo.png';

class RecentOrders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            recent: []
        };
    }

    componentDidMount() {
        const data = {
            customerEmail: this.props.email
        }
        axios.post(`${serverURL}/getrecentorders`, { data: data })
            .then(res => {
                console.log(res.data)
                // console.log(Array.from(res.data.data));
                this.setState({
                    recent: Array.from(res.data)
                });
            })
            .catch(err => {
                this.setState({
                    recent: []
                });
            })
    }

    componentDidUpdate(prevProps) {
        if (this.props !== prevProps) {
            const data = {
                customerEmail: this.props.email
            }
            axios.post(`${serverURL}/getrecentorders`, { data: data })
                .then(res => {
                    console.log(res.data)
                    // console.log(Array.from(res.data.data));
                    this.setState({
                        recent: Array.from(res.data)
                    });
                })
                .catch(err => {
                    this.setState({
                        recent: []
                    });
                })
        }
    }

    handleOrderClick = (e, order) => {
        // console.log(this.props);
        const { openModal } = this.props;
        e.preventDefault();
        this.props.openModal(ModalKey.ORDER_STATUS, { order });
    }

    render() {
        if(this.state.recent.length < 1) {
            return null;
        }
        return (
            <Container className="recent-orders-container">
                <p className="recent-orders-heading">Your recent orders</p>
                <div className="recent-orders-list" horizontal>
                    {this.state.recent.map(item => (
                        <ListGroup>
                            <ListGroup.Item className="recent-order" action onClick={e => this.handleOrderClick(e, item)}>
                                <div className="recent-order-inner">
                                    <div>
                                        <NavLink className="recent-link-name" onClick={e => this.handleOrderClick(e, item)}>
                                            <Image rounded className="recent-order-image" src={item.picture} />
                                        </NavLink>
                                    </div>
                                    <div className="recent-order-info">
                                        <div className="recent-order-name">
                                            Your order from
                                        <NavLink className="recent-link-name" onClick={e => this.handleOrderClick(e, item)}>
                                                <p>{item.name}</p>
                                            </NavLink>
                                        </div>
                                        <div className="recent-order-date">
                                            <p>{new Date(parseInt(item.orderedAt)).toLocaleString('en-US')}</p>
                                        </div>
                                    </div>
                                </div>
                            </ListGroup.Item>
                        </ListGroup>
                    ))}
                </div>
            </Container>
        )
    }

}
export default RecentOrders;