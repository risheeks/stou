import React, { Component } from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import stoulogo from '../../../constants/images/stoulogo.png';
import { withRouter } from 'react-router-dom';
import OnlineStatus from '../../OnlineStatus';
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

    clickMenu = e => {
        e.preventDefault()
        const self = this;
        axios.post(`${serverURL}/getpastfoodcook`, { 
            data: {
                email:this.props.email,
            }
        })
        .then(res => {
            console.log(res.data)
            this.setState({
                fooditems: Array.from(res.data.data)
            });
            const { openModal, addToOrder, name} = this.props;
            const {fooditems} = this.state
            
            openModal(ModalKey.MENU_MODAL, {fooditems,addToOrder,openModal, name});
            console.log(this.state.fooditems)   
        }).catch(function (error) {
            const { openModal, name} = self.props;
            openModal(ModalKey.MENU_MODAL, {openModal, name});
        });
    }

    changeLocation = e => {
        this.props.openModal(ModalKey.ZIPCODE, {email: this.props.email, changeLocation: this.props.changeLocation})
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
                        {this.props.loggedIn ?
                            <Nav.Link as={Link} className="nav-link" to="/" onClick={this.changeLocation}>Change location</Nav.Link> : null}
                        {!this.props.loggedIn ?
                            <Nav.Link as={Link} className="nav-link" to="/login">Login</Nav.Link> : null}
                        {this.props.loggedIn ?
                            <Nav.Link as={Link} className="nav-link" to="/profile">Profile</Nav.Link> : null}
                        {this.props.loggedIn ?
                            <Nav.Link as={Link} className="nav-link" to="/orders">Orders</Nav.Link> : null}
                        {this.props.loggedIn ?
                            <Nav.Link as={Link} className="nav-link" to="/addfood">Add Food Item</Nav.Link> : null}
                        {this.props.loggedIn ?
                            <Nav.Link as={Link} className="nav-link" to="/homecookmenu" onClick={this.clickMenu}>Menu</Nav.Link> : null}
                        {this.props.loggedIn ?
                            <Nav.Link as={Link} className="nav-link" to="/" onClick={this.handleSignOut}>Sign Out</Nav.Link> : null}
                    </Nav>
                    {this.props.loggedIn ?<OnlineStatus
                            email={email}
                            openModal={openModal}
                        />: null}
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default withRouter(Header);