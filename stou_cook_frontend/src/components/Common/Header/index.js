import React, { Component } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import stoulogo from '../../../constants/images/stoulogo.png';

export class Header extends Component {
    render() {
        return (
            <Navbar className="navbar" expand="lg" sticky="top">
                <Navbar.Brand href="#home">
                    <img className="navbar-logo" src={stoulogo} />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav variant="pills" defaultActiveKey="#home" className="navbar-content ml-auto">
                        <Nav.Link className="nav-link" href="#home">Home</Nav.Link>
                        <Nav.Link className="nav-link" href="#login">Login</Nav.Link>
                        <Nav.Link className="nav-link" href="#about">About</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default Header;