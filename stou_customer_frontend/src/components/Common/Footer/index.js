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
    shareApp = () => {
        this.props.openModal(ModalKey.SHAREAPP, {email: this.props.email})
    }
    privacyPolicy = () => {
        this.props.openModal(ModalKey.PRIVACY)
    }

    render() {
        const { loggedIn } = this.props;
        return (
            <Navbar className="navbar-footer" expand="lg">
                {/* <Navbar.Brand as={Link} to="/">
                    <Image className="navbar-logo" src={stoulogo} />
                </Navbar.Brand> */}
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav variant="pills" defaultActiveKey="/" className="navbar-content-footer ml-auto">

                    {loggedIn ?
                            <Nav.Link as={Link} className="nav-link" to="/" onClick={this.sendFeedback}>Feedback</Nav.Link> : null}
                            <Nav.Link as={Link} className="nav-link" to="/" onClick={this.privacyPolicy}>Privacy Policy</Nav.Link>
                            <Nav.Link as={Link} className="nav-link" to="/" onClick={this.shareApp}>Share App!</Nav.Link> 
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default Footer;