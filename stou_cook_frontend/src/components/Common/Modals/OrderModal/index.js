import React, { Component } from 'react';
import { Modal, Button, Image } from 'react-bootstrap';
import OrderProgress from './OrderProgress';

class OrderModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            reason: ''
        };
    }

    render() {
        const { showModal, closeModal, order } = this.props;

        return (
            <Modal show={showModal} onHide={() => closeModal()}>
                <Modal.Header closeButton>
                    You have a new order!
                </Modal.Header>
                <Modal.Body>
                    <OrderProgress status={order.orderStatus} />
                    {/*items.map(item =>
                        <div className="order-item-info">
                            <div className="order-item-name">
                                <p>{item.name}</p>
                            </div>
                            <div className="order-item-quantity">
                                <p>x {item.quantity}</p>
                            </div>
                        </div>
                    )*/}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger">Decline</Button>
                    <Button variant="success">Accept</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default OrderModal;