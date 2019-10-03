import React, { Component } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import stoulogo from '../../../constants/images/stoulogo.png';

export class Header extends Component {
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
                        <Nav.Link as={Link} className="nav-link" to="/login">Login</Nav.Link>
                        <Nav.Link as={Link} className="nav-link" to="/about">About</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default Header;