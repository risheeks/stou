import React, { Component } from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import stoulogo from '../../../constants/images/white_logo.png';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import { serverURL } from '../../../config';
import { ModalKey } from '../../../constants/ModalKeys';

export class Header extends Component {
    constructor(props) {
        super(props);

        this.state = {
            fooditems:[]
        };
    
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

    render() {
        const { openModal, email } = this.props;
        return (
            <Navbar className="navbar" expand="lg" sticky="top">
                <Navbar.Brand as={Link} to="/">
                    <img className="navbar-logo" src={stoulogo} />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav variant="pills" defaultActiveKey="/" className="navbar-content ml-auto">
                        {!this.props.loggedIn ?
                            <Nav.Link as={Link} className="nav-link" to="/login">Login</Nav.Link> : null}
                        {this.props.loggedIn ?
                            <Nav.Link as={Link} className="nav-link" to="/" onClick={this.handleSignOut}>Sign Out</Nav.Link> : null}
                        {!this.props.loggedIn ?
                            <Nav.Link as={Link} className="nav-link" to="/feedback">Feedback</Nav.Link> : null}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default withRouter(Header);