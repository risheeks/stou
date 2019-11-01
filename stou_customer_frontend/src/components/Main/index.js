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
import { addToOrder, removeFromOrder, refresh, clearOrder } from '../../actions/order.action';
import Checkout from '../Checkout';
import { ModalKey } from '../../constants/ModalKeys';
import axios from 'axios';
import { serverURL } from '../../config';
import { ROLE } from '../../constants';
import Orders from '../Orders';

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
    return bindActionCreators({ getToken, signOut, openModal, closeModal, addToOrder, removeFromOrder, refresh, changeLocation, clearOrder }, dispatch);
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
        let tempLocation = localStorage.getItem('location');
        if (tempToken && tempEmail) {
            const data = {
                token: tempToken,
                email: tempEmail
            }
            await axios.post(`${serverURL}/checklogin`, { data })
                .then(res => {
                    this.props.getToken(tempToken, tempEmail);
                })
        }
        const { auth_token, email, location } = this.props;
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
        if (prevProps !== this.props) {
            const { auth_token, email, location } = this.props;
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
        const { signOut, auth_token, email, getToken, modalProps, openModal, closeModal, addToOrder, removeFromOrder, refresh, baggedItems, location, changeLocation, clearOrder } = this.props;
        const loggedIn = auth_token && auth_token.length > 0;
        console.log(location);
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
                        location={location}
                        baggedItems={baggedItems}
                        clearOrder={clearOrder}
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
                        openModal={openModal}
                        auth_token={auth_token}
                        email={email}
                    />}
                />
                <Route path="/profile" render={() =>
                    <Profile
                        auth_token={auth_token}
                        email={email}
                        location={location}
                    />}
                />
                <Route path="/orders" render={() =>
                    <Orders
                        openModal={openModal}
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
                        openModal={openModal}
                        clearOrder={clearOrder}
                        location={location}
                    />}
                />
                <MyModal {...modalProps} closeModal={closeModal} />
            </Router>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);
