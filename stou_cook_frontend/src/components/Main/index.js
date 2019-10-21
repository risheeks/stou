import React, { Component } from 'react';

import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Login from '../Login';
import Register from '../Register';
import Home from '../Home';
import Header from '../Common/Header';
import AddFoodItem from '../AddFoodItem';
import Profile from '../Profile';
import '../../styles/Main.css';

import { getToken, signOut } from '../../actions/login.action';
import PrivacyPolicy from '../PrivacyPolicy';
import { openModal, closeModal } from '../../actions/modal.action';

function mapStateToProps(state) {
    return {
        auth_token: state.loginReducer.auth_token,
        email: state.loginReducer.email,
        showModal: state.modalReducer.showModal,
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ getToken, signOut, openModal, closeModal }, dispatch);
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
        if(tempToken && tempEmail) {
            this.props.getToken(tempToken, tempEmail);
        }
    }

    render() {
        const { signOut, auth_token, email, getToken, openModal, closeModal, showModal } = this.props;
        const loggedIn = auth_token && auth_token.length > 0;
        console.log(auth_token);
        return (
            <Router>
                <Header signOut={signOut} loggedIn={loggedIn} />
                <Route exact path="/" render={() => <Home auth_token={auth_token} email={email} />} />
                <Route path="/login" render={() => <Login auth_token={auth_token} email={email} getToken={getToken} openModal={openModal} closeModal={closeModal} showModal={showModal} />} />
                <Route path="/register" render={() => <Register auth_token={auth_token} email={email} getToken={getToken} />} />
                <Route path="/addfood" render={() => <AddFoodItem auth_token={auth_token} email={email} />} />
                <Route path="/profile" render={() => <Profile auth_token={auth_token} email={email} />} />
                <Route path="/privacyPolicy" render={() => <PrivacyPolicy auth_token={auth_token} email={email} />} />
            </Router>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);