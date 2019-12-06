import React, { Component } from 'react';

import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Login from '../Login';
import Register from '../Register';
import Home from '../Home';
import Header from '../Common/Header';
import Footer from '../Common/Footer';
import Profile from '../Profile';
import FavoriteHomeCooksList from '../FavoriteHomeCooks';
import '../../styles/Main.css';
import MyModal from '../Common/Modals';

import { getToken, signOut, changeLocation } from '../../actions/login.action';
import { openModal, closeModal } from '../../actions/modal.action';
import { addToOrder, removeFromOrder, refresh, clearOrder } from '../../actions/order.action';
import Checkout from '../Checkout';
import { ModalKey } from '../../constants/ModalKeys';
import axios from 'axios';
import { serverURL, pusher } from '../../config';
import { ROLE } from '../../constants';
import Orders from '../Orders';
import Chat from '../Chat';
import notificationSound from '../../constants/sounds/notification.mp3';
import Requests from '../Requests'

function mapStateToProps(state) {
    return {
        auth_token: state.loginReducer.auth_token,
        email: state.loginReducer.email,
        zipcode: state.loginReducer.zipcode,
        modalProps: state.modalReducer,
        baggedItems: state.orderReducer.baggedItems
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ getToken, signOut, openModal, closeModal, addToOrder, removeFromOrder, refresh, changeLocation, clearOrder }, dispatch);
}

const ProtectedRoute
    = ({ isAllowed, ...rest }) =>
        isAllowed
            ? <Route {...rest} />
            : <Redirect to="/login" />;

class Main extends Component {

    constructor(props) {
        super(props);
        this.state = {
            zipcode: null
        }
    }

    async componentDidMount() {
        let tempToken = localStorage.getItem('auth_token');
        let tempEmail = localStorage.getItem('email');
        if (tempToken && tempEmail) {
            const data = {
                token: tempToken,
                email: tempEmail,
                role: 2
            }
            console.log(tempToken)
            await axios.post(`${serverURL}/checklogin`, { data })
                .then(res => {
                    this.props.getToken(tempToken, tempEmail);
                })
                .catch(err => {
                    this.props.signOut();
                })
        }
        const { auth_token, email, zipcode } = this.props;
        const loggedIn = auth_token && auth_token.length > 0;
        if (loggedIn) {
            const newLocation = await this.getLocation();
            if (!newLocation || newLocation === '') {
                this.props.openModal(ModalKey.ZIPCODE, { email: email, changeLocation: this.props.changeLocation });
            }
            else {
                this.props.changeLocation(newLocation);
            }
        }
    }

    async componentDidUpdate(prevProps) {
        if (prevProps.zipcode !== this.props.zipcode || prevProps.email !== this.props.email) {
            const { auth_token, email, zipcode, openModal } = this.props;
            const loggedIn = auth_token && auth_token.length > 0;
            let channel = pusher.subscribe(`customer-${email}`);
            channel.bind('order-update', function (data) {
                const audio = new Audio(notificationSound);
                audio.play();
                openModal(ModalKey.ORDER_UPDATE, { ...data });
            });
            channel.bind('cook-online', function(data) {
                const audio = new Audio(notificationSound);
                audio.play();
                openModal(ModalKey.COOK_ONLINE, { ...data });
            });
            channel.bind('request-update', function(data) {
                const audio = new Audio(notificationSound);
                audio.play();
                openModal(ModalKey.REQUEST_UPDATE, { ...data });
            });
            if (loggedIn) {
                const newLocation = await this.getLocation();
                if (!newLocation || newLocation === '') {
                    this.props.openModal(ModalKey.ZIPCODE, { email: email, changeLocation: this.props.changeLocation });
                }
                else {
                    this.props.changeLocation(newLocation);
                }
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
        const { signOut, auth_token, email, getToken, modalProps, openModal, closeModal, addToOrder, removeFromOrder, refresh, baggedItems, zipcode, changeLocation, clearOrder } = this.props;
        const loggedIn = auth_token && auth_token.length > 0;
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
                    changeLocation={changeLocation}
                    openModal={openModal}
                />
                <Route exact path="/" render={() =>
                    <Home
                        auth_token={auth_token}
                        email={email}
                        openModal={openModal}
                        addToOrder={addToOrder}
                        location={zipcode}
                        baggedItems={baggedItems}
                        clearOrder={clearOrder}
                    />}
                />
                <Route path="/login" render={() =>
                    <Login
                        auth_token={auth_token}
                        email={email}
                        getToken={getToken}
                        openModal={openModal}
                    />}
                />
                <Route path="/register" render={() =>
                    <Register
                        auth_token={auth_token}
                        email={email}
                        getToken={getToken}
                        openModal={openModal}
                    />}
                />
                <ProtectedRoute isAllowed={loggedIn} path="/favoriteHomecooks" render={() =>
                    <FavoriteHomeCooksList
                        openModal={openModal}
                        auth_token={auth_token}
                        email={email}
                    />}
                />
                <ProtectedRoute isAllowed={loggedIn} path="/requests" render={() =>
                    <Requests
                        openModal={openModal}
                        auth_token={auth_token}
                        email={email}
                    />}
                />
                <ProtectedRoute isAllowed={loggedIn} path="/profile" render={() =>
                    <Profile
                        auth_token={auth_token}
                        email={email}
                        location={zipcode}
                        openModal={openModal}
                    />}
                />
                <ProtectedRoute isAllowed={loggedIn} path="/orders" render={() =>
                    <Orders
                        openModal={openModal}
                        auth_token={auth_token}
                        email={email}
                    />}
                />
                <ProtectedRoute isAllowed={loggedIn} path="/checkout" render={() =>
                    <Checkout
                        auth_token={auth_token}
                        email={email}
                        baggedItems={baggedItems}
                        refresh={refresh}
                        openModal={openModal}
                        clearOrder={clearOrder}
                        zipcode={zipcode}
                    />}
                />
                <Footer
                openModal={openModal}
                email={email}
                loggedIn={loggedIn}
                />
                <MyModal {...modalProps} closeModal={closeModal} />
                {loggedIn ? <Chat auth_token={auth_token} email={email} /> : null}
            </Router>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);
