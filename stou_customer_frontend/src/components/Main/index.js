import React, { Component } from 'react';

import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Login from '../Login';
import Register from '../Register';
import Home from '../Home';
import Header from '../Common/Header';
import Profile from '../Profile';
import '../../styles/Main.css';
import MyModal from '../../../../stou_customer_frontend/src/components/Common/Modals';

import { getToken, signOut } from '../../actions/login.action';
import { openModal, closeModal } from '../../actions/modal.action';
import { addToOrder, removeFromOrder, refresh } from '../../actions/order.action';
import Checkout from '../Checkout';

function mapStateToProps(state) {
    return {
        auth_token: state.loginReducer.auth_token,
        email: state.loginReducer.email,
        modalProps: state.modalReducer,
        baggedItems: state.orderReducer.baggedItems
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ getToken, signOut, openModal, closeModal, addToOrder, removeFromOrder, refresh }, dispatch);
}

const ProtectedRoute
    = ({ isAllowed, ...props }) =>
        isAllowed
            ? <Route {...props} />
            : <Redirect to="/login" />;

class Main extends Component {
    componentDidMount() {
        let tempToken = localStorage.getItem('auth_token');
        let tempEmail = localStorage.getItem('email');
        if (tempToken && tempEmail) {
            this.props.getToken(tempToken, tempEmail);
        }
    }

    render() {
        const { signOut, auth_token, email, getToken, modalProps, openModal, closeModal, addToOrder, removeFromOrder, refresh, baggedItems } = this.props;
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
