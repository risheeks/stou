import React, { Component } from 'react';
import { ListGroup, Button } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

import BagItem from './BagItem';

class Bag extends Component {
    constructor(props) {
        super(props);
    }

    getSubtotal = () => {
        const { baggedItems } = this.props;
        let sum = 0;
        for (let i = 0; i < baggedItems.length; i++) {
            sum += baggedItems[i].price * baggedItems[i].quantity;
        }
        return sum;
    }

    onCheckout = e => {
        this.props.history.push('/checkout')
    }

    render() {
        const { baggedItems, removeFromOrder } = this.props;
        console.log(baggedItems)
        if (baggedItems.length > 0) {
            return (
                <ListGroup>
                    <ListGroup.Item>
                        <b>Your Order</b>
                    </ListGroup.Item>
                    {baggedItems.map(item =>
                        <BagItem
                            id={item.id}
                            name={item.name}
                            price={item.price}
                            quantity={item.quantity}
                            removeFromOrder={removeFromOrder}
                        />
                    )}
                    <ListGroup.Item>
                        <div className="bag-item-container">
                            <p className="bag-item-name"><b>Subtotal:</b></p>
                            <p className="bag-item-price">${this.getSubtotal()}</p>
                        </div>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Button variant="success" onClick={this.onCheckout}>Continue to Checkout</Button>
                    </ListGroup.Item>
                </ListGroup>
            );
        }
        return (
            <ListGroup>
                <ListGroup.Item>
                    Your bag is empty
                </ListGroup.Item>
            </ListGroup>
        );
    }
}

export default withRouter(Bag);