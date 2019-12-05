import React, { Component } from 'react';
import { Navbar, Nav, Button, Image, Popover, OverlayTrigger, ButtonToolbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import stoulogo from '../../../constants/images/stoulogo.png';
import bag from '../../../constants/images/bag.png';
import { withRouter } from 'react-router-dom';
import Bag from '../Bag';
import axios from 'axios';
import { serverURL } from '../../../config';
import { ModalKey } from '../../../constants/ModalKeys';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            routeKey: this.props.location.pathname.replace('/', '')
        }
    }

    componentDidMount() {
        this.props.refresh();
    }

    handleSignOut = e => {
        e.preventDefault();
        const { auth_token } = this.props;
        const data = {
            token: auth_token
        }
        axios.post(`${serverURL}/logout`, {data})
            .then(res => {
                this.props.signOut();
                this.props.history.push('/');
            })
    }

    onBagClick = e => {
        e.preventDefault();
    }

    getNumItems = () => {
        const { baggedItems } = this.props;
        let sum = 0;
        for (let i = 0; i < baggedItems.length; i++) {
            sum += baggedItems[i].quantity;
        }
        return sum;
    }

    changeLocation = e => {
        this.props.openModal(ModalKey.ZIPCODE, {email: this.props.email, changeLocation: this.props.changeLocation})
    }

    render() {
        const { baggedItems, removeFromOrder, refresh, auth_token, email, loggedIn } = this.props;
        console.log(this.state.routeKey)
        return (
            <Navbar className="navbar" expand="lg" sticky="top">
                <Navbar.Brand as={Link} to="/">
                    <Image className="navbar-logo" src={stoulogo} />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav variant="pills" defaultActiveKey={this.state.routeKey} className="navbar-content ml-auto">
                        {loggedIn ?
                            <Nav.Link as={Link} className="nav-link" to="/" onClick={this.changeLocation}>Change location</Nav.Link> : null}
                        <Nav.Link as={Link} eventKey="home" className="nav-link" to="/">Home</Nav.Link>
                        {!loggedIn ?
                            <Nav.Link as={Link} eventKey="login" className="nav-link" to="/login">Login</Nav.Link> : null}
                        {loggedIn ?
                            <Nav.Link as={Link} eventKey="profile" className="nav-link" to="/profile">Profile</Nav.Link> : null}
                        {loggedIn ?
                            <Nav.Link as={Link} eventKey="orders" className="nav-link" to="/orders">Orders</Nav.Link> : null}
                        {loggedIn ?
                            <Nav.Link as={Link} eventKey="favoriteHomecooks" className="nav-link" to="/favoriteHomecooks">Favorites</Nav.Link> : null}
                        {loggedIn ?
                            <Nav.Link as={Link} eventKey="requests" className="nav-link" to="/requests">Requests</Nav.Link> : null}    
                        {loggedIn ?
                            <Nav.Link as={Link} className="nav-link" to="/" onClick={this.handleSignOut}>Sign Out</Nav.Link> : null}
                        <OverlayTrigger
                            trigger="click"
                            key="bottom"
                            placement="bottom"
                            overlay={
                                <Popover className="bag-popover" id={`popover-positioned-bottom`}>
                                    <Bag
                                        auth_token={auth_token}
                                        email={email}
                                        baggedItems={baggedItems}
                                        removeFromOrder={removeFromOrder}
                                        refresh={refresh}
                                    />
                                </Popover>
                            }
                        >
                            <Nav.Link as={Link} className="nav-link" to="/bag" onClick={this.onBagClick}>
                                <Image className="bag-link" src={bag} />
                                <b className="bag-number">{this.getNumItems() > 0 ? this.getNumItems() : null}</b>
                            </Nav.Link>
                        </OverlayTrigger>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default withRouter(Header);