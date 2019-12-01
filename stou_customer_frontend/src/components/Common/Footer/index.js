import React, { Component } from 'react';
import { Navbar, Nav, Button, Image, Popover, OverlayTrigger, ButtonToolbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import stoulogo from '../../../constants/images/stoulogo.png';
import { ModalKey } from '../../../constants/ModalKeys';

class Footer extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        
    }

    sendFeedback = () => {
        this.props.openModal(ModalKey.FEEDBACK, {email: this.props.email})
    }

    render() {
        const { loggedIn } = this.props;
        return (
            <Navbar className="navbar" expand="lg" sticky="top">
                <Navbar.Brand as={Link} to="/">
                    <Image className="navbar-logo" src={stoulogo} />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav variant="pills" defaultActiveKey="/" className="navbar-content ml-auto">

                    {loggedIn ?
                            <Nav.Link as={Link} className="nav-link" to="/" onClick={this.sendFeedback}>Feedback!</Nav.Link> : null}
                            <Nav.Link as={Link} className="nav-link" to="/">About Us</Nav.Link>
                            <Nav.Link as={Link} className="nav-link" to="/">Contact Us</Nav.Link> 
                            <Nav.Link as={Link} className="nav-link" to="/">Values</Nav.Link> 
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default Footer;