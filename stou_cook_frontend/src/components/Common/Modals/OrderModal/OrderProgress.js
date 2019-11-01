import React, { Component } from 'react';
import { ProgressBar } from 'react-bootstrap';

class OrderProgress extends Component {
    constructor(props) {
        super(props);
        this.state = {
            now: 100,
            orderStatus: '',
        }
    }

    componentDidMount() {
        this.setCorrectState();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.status !== this.props.status) {
            this.setCorrectState();
        }
    }

    setCorrectState = () => {
        const { status } = this.props;
        let orderStatus = status;
        let newNow = 0;

        switch (status) {
            case 'placed':
                orderStatus = 'Order placed!';
                newNow = 10;
                break;
            case 'in_progress':
                orderStatus = 'Your food is being prepared!';
                newNow = 40;
                break;
            case 'on_the_way':
                orderStatus = 'Your food is on its way';
                newNow = 75;
                break;
            case 'delivered':
                orderStatus = 'Order delivered!';
                newNow = 100;
                break;
            case 'request_cancel':
                orderStatus = 'Customer requests cancellation';
                newNow = 0;
                break;
            case 'declined':
                orderStatus = 'Order declined';
                newNow = 0;
                break;
            case 'cancelled':
                orderStatus = 'Order Cancelled';
                newNow = 0;
                break;
            default:
                orderStatus = status;
                newNow = 0;
                break;
        }

        this.setState({
            now: newNow,
            orderStatus: orderStatus,
        });
    }

    render() {
        const { now, orderStatus } = this.state;

        return (
            <div>
                <div className="order-tooltip-outer" style={{ marginLeft: `${now}%`, marginRight: `${100 - now}%` }}>
                    <div className="order-tooltip">{orderStatus}</div>
                    <div className="arrow-down"></div>
                </div>
                <ProgressBar variant="danger" now={now} animated />
            </div>
        );
    }
}

export default OrderProgress;