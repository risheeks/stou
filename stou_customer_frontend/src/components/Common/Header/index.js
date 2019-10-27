import React, { Component } from 'react';
import { Navbar, Nav, Button, Image, Popover, OverlayTrigger, ButtonToolbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import stoulogo from '../../../constants/images/stoulogo.png';
import bag from '../../../constants/images/bag.png';
import { withRouter } from 'react-router-dom';
import Bag from '../Bag';

class Header extends Component {
    componentDidMount() {
        this.props.refresh();
    }

    handleSignOut = e => {
        e.preventDefault();
        this.props.signOut();
    }

    onBagClick = e => {
        e.preventDefault();
    }

    render() {
        const { baggedItems, removeFromOrder, refresh } = this.props

        return (
            <Navbar className="navbar" expand="lg" sticky="top">
                <Navbar.Brand as={Link} to="/">
                    <Image className="navbar-logo" src={stoulogo} />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav variant="pills" defaultActiveKey="/" className="navbar-content ml-auto">
                        <Nav.Link as={Link} className="nav-link" to="/">Home</Nav.Link>
                        {!this.props.loggedIn ?
                            <Nav.Link as={Link} className="nav-link" to="/login">Login</Nav.Link> : null}
                        <Nav.Link as={Link} className="nav-link" to="/favoriteHomecooks">Favorites</Nav.Link>
                        {this.props.loggedIn ?
                            <Nav.Link as={Link} className="nav-link" to="/" onClick={this.handleSignOut}>Sign Out</Nav.Link> : null}
                        <OverlayTrigger
                            trigger="click"
                            key="bottom"
                            placement="bottom"
                            overlay={
                                <Popover className="bag-popover" id={`popover-positioned-bottom`}>
                                    <Bag
                                        baggedItems={baggedItems}
                                        removeFromOrder={removeFromOrder}
                                        refresh={refresh}
                                    />
                                </Popover>
                            }
                        >
                            <Nav.Link as={Link} className="nav-link" to="/bag" onClick={this.onBagClick}>
                                <Image className="bag-link" src={bag} />
                                <b className="bag-number">{baggedItems.length > 0 ? baggedItems.length : null}</b>
                            </Nav.Link>
                        </OverlayTrigger>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default withRouter(Header);