import React, { Component } from 'react';

import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Login from '../Login';
import Register from '../Register';
import Home from '../Home';
import Header from '../Common/Header';
import Profile from '../Profile';
import FavoriteHomeCooksList from '../FavoriteHomeCooks';
import '../../styles/Main.css';
import MyModal from '../../../../stou_customer_frontend/src/components/Common/Modals';

import { getToken, signOut, changeLocation } from '../../actions/login.action';
import { openModal, closeModal } from '../../actions/modal.action';
import { addToOrder, removeFromOrder, refresh } from '../../actions/order.action';
import Checkout from '../Checkout';
import Pusher from 'pusher-js';
import { ModalKey } from '../../constants/ModalKeys';
import axios from 'axios';
import { serverURL } from '../../config';
import { ROLE } from '../../constants';

// Enable pusher logging - don't include this in production
Pusher.logToConsole = true;

var pusher = new Pusher('244fae1265174aa1b9eb', {
  cluster: 'us2',
  forceTLS: true
});

var channel = pusher.subscribe('my-channel1');
channel.bind('my-event', function(data) {
  return;
});

function mapStateToProps(state) {
    return {
        auth_token: state.loginReducer.auth_token,
        email: state.loginReducer.email,
        location: state.loginReducer.location,
        modalProps: state.modalReducer,
        baggedItems: state.orderReducer.baggedItems
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ getToken, signOut, openModal, closeModal, addToOrder, removeFromOrder, refresh, changeLocation }, dispatch);
}

const ProtectedRoute
    = ({ isAllowed, ...props }) =>
        isAllowed
            ? <Route {...props} />
            : <Redirect to="/login" />;

class Main extends Component {
    async componentDidMount() {
        let tempToken = localStorage.getItem('auth_token');
        let tempEmail = localStorage.getItem('email');
        if (tempToken && tempEmail) {
            await this.props.getToken(tempToken, tempEmail);
        }
        const { auth_token, email, location } = this.props;
        const loggedIn = auth_token && auth_token.length > 0;
        if(loggedIn) {
            const newLocation = await this.getLocation();
            if(!newLocation || newLocation === '') {
                this.props.openModal(ModalKey.ZIPCODE, { email: email, changeLocation: this.props.changeLocation });
            }
            else {
                this.props.changeLocation(newLocation);
            }
        }
    }

    getLocation = async () => {
        const data = {
            email: this.props.email,
            role: ROLE
        };

        let location = null;

        await axios.post(`${serverURL}/getlocation`, { data: data })
            .then(res => {
                location = res.data.data.location;
            });
        return location;
    }

    render() {
        const { signOut, auth_token, email, getToken, modalProps, openModal, closeModal, addToOrder, removeFromOrder, refresh, baggedItems, location } = this.props;
        const loggedIn = auth_token && auth_token.length > 0;
        console.log(auth_token);
        return (
            <Router>
                <Header
                    auth_token={auth_token}
                    email={email}
                    signOut={signOut}
                    loggedIn={loggedIn}
                    removeFromOrder={removeFromOrder}
                    refresh={refresh}
                    baggedItems={baggedItems}
                />
                <Route exact path="/" render={() =>
                    <Home
                        auth_token={auth_token}
                        email={email}
                        openModal={openModal}
                        addToOrder={addToOrder}
                        location={location}
                    />}
                />
                <Route path="/login" render={() =>
                    <Login
                        auth_token={auth_token}
                        email={email}
                        getToken={getToken}
                    />}
                />
                <Route path="/register" render={() =>
                    <Register
                        auth_token={auth_token}
                        email={email}
                        getToken={getToken}
                    />}
                />
                <Route path="/favoriteHomecooks" render={() => 
                    <FavoriteHomeCooksList
                        auth_token={auth_token}
                        email={email}
                    />}
                />
                <Route path="/profile" render={() => 
                    <Profile
                        auth_token={auth_token}
                        email={email}
                    />}
                />
                <Route path="/checkout" render={() =>
                    <Checkout
                        auth_token={auth_token}
                        email={email}
                        baggedItems={baggedItems}
                        refresh={refresh}
                    />}
                />
                <MyModal {...modalProps} closeModal={closeModal} />
            </Router>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);
