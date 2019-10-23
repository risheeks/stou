import React, { Component } from 'react';
import { ListGroup, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import BagItem from './BagItem';
import { addToOrder, removeFromOrder, refresh } from '../../../actions/order.action';

function mapStateToProps(state) {
    state = state.orderReducer;
    return {
        baggedItems: state.baggedItems
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ addToOrder, removeFromOrder, refresh }, dispatch);
}

class Bag extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.refresh();
    }

    render() {
        const { baggedItems } = this.props;

        return (
            <ListGroup>
                <ListGroup.Item>
                    <b>Your Order</b>
                </ListGroup.Item>
                {baggedItems.map(item => 
                    <BagItem name={item.name} price={item.price} quantity={item.quantity} />
                )}
                <ListGroup.Item>
                    <Button variant="success">Continue to Checkout</Button>
                </ListGroup.Item>
            </ListGroup>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Bag);