import React, { Component } from 'react';
import { ListGroup, Button, Image } from 'react-bootstrap';
import deleteicon from '../../../constants/images/delete.png';

class BagItem extends Component {
    constructor(props) {
        super(props);
    }

    deleteItem = e => {
        e.preventDefault();
        this.props.removeFromOrder(this.props.id);
    }

    render() {
        const { name, price, quantity } = this.props;
        console.log(this.props)
        return (
            <ListGroup.Item className="bag-item-container">
                    <p className="bag-item-quantity">{quantity}</p>
                    <p className="bag-item-name">{name}</p>
                    <Button variant="link" className="delete-item-button" onClick={this.deleteItem}>
                        <Image
                            className="delete-item-image"
                            src={deleteicon}
                        />
                    </Button>
                    <p className="bag-item-price">${price}</p>
            </ListGroup.Item>
        );
    }
}

export default BagItem;