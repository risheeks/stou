import React, { Component } from 'react';

import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Home from '../Home';
import Header from '../Common/Header';
import '../../styles/Main.css';
import MyModal from '../Common/Modals';
import { getToken, signOut } from '../../actions/login.action';
import { openModal, closeModal } from '../../actions/modal.action';
import { ModalKey } from '../../constants/ModalKeys';
import axios from 'axios';
import { serverURL } from '../../config';

function mapStateToProps(state) {
    return {
        auth_token: state.loginReducer.auth_token,
        email: state.loginReducer.email,
        showModal: state.modalReducer.showModal,
        modalProps: state.modalReducer
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ getToken, signOut, openModal, closeModal }, dispatch);
}

class Main extends Component {
    async componentDidMount() {
        let tempToken = localStorage.getItem('auth_token');
        let tempEmail = localStorage.getItem('email');
        if(tempToken && tempEmail) {
            const data = {
                token: tempToken,
                email: tempEmail
            }
            await axios.post(`${serverURL}/checklogin`, {data})
                .then(res => {
                    this.props.getToken(tempToken, tempEmail);
                })
                .catch(err => {
                    this.props.signOut();
                })
        }
    }

    render() {
        const { auth_token, email, modalProps, closeModal, openModal } = this.props;
        const loggedIn = auth_token && auth_token.length > 0;
        console.log(modalProps);
        return (
            <Router>
                <Header loggedIn={loggedIn} />
                <Route exact path="/" render={() => <Home  openModal={openModal} />} />
                <MyModal {...modalProps} closeModal={closeModal} />
            </Router>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);
