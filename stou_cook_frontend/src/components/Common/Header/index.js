import React, { Component } from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import stoulogo from '../../../constants/images/stoulogo.png';
import { withRouter } from 'react-router-dom';

export class Header extends Component {
    handleSignOut = e => {
        e.preventDefault();
        this.props.signOut();
        this.props.history.push('/');
    }

    render() {
        return (
            <Navbar className="navbar" expand="lg" sticky="top">
                <Navbar.Brand as={Link} to="/">
                    <img className="navbar-logo" src={stoulogo} />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav variant="pills" defaultActiveKey="/" className="navbar-content ml-auto">
                        <Nav.Link as={Link} className="nav-link" to="/">Home</Nav.Link>
                        { !this.props.loggedIn ?
                        <Nav.Link as={Link} className="nav-link" to="/login">Login</Nav.Link> : null}
                        <Nav.Link as={Link} className="nav-link" to="/about">About</Nav.Link>
                        { this.props.loggedIn ?
                        <Nav.Link as={Link} className="nav-link" to="/addfood">Add Food Item</Nav.Link> : null}
                        { this.props.loggedIn ?
                        <Nav.Link as={Link} className="nav-link" to="/" onClick={this.handleSignOut}>Sign Out</Nav.Link> : null}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default withRouter(Header);