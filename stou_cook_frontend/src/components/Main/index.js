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
import Chat from '../Chat';
import '../../styles/Main.css';
import MyModal from '../Common/Modals';
import { getToken, signOut, changeLocation } from '../../actions/login.action';
import PrivacyPolicy from '../PrivacyPolicy';
import { openModal, closeModal } from '../../actions/modal.action';
import { ModalKey } from '../../constants/ModalKeys';
import axios from 'axios';
import { serverURL, pusher } from '../../config';
import { ROLE } from '../../constants';
import Orders from '../Orders';
import Requests from '../Requests';
import MenuModal from '../Common/Modals/MenuModal.js'
import notificationSound from '../../constants/sounds/notification.mp3';

function mapStateToProps(state) {
    return {
        auth_token: state.loginReducer.auth_token,
        email: state.loginReducer.email,
        showModal: state.modalReducer.showModal,
        zipcode: state.loginReducer.zipcode,
        modalProps: state.modalReducer
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ getToken, signOut, openModal, closeModal, changeLocation }, dispatch);
}

const ProtectedRoute
    = ({ isAllowed, ...rest }) =>
        isAllowed
            ? <Route {...rest} />
            : <Redirect to="/login" />;

class Main extends Component {
    async componentDidMount() {
        let tempToken = localStorage.getItem('auth_token');
        let tempEmail = localStorage.getItem('email');
        if(tempToken && tempEmail) {
            const data = {
                token: tempToken,
                email: tempEmail,
                role: 1
            }
            await axios.post(`${serverURL}/checklogin`, {data})
                .then(res => {
                    this.props.getToken(tempToken, tempEmail);
                })
                .catch(err => {
                    this.props.signOut();
                })
        }
        const { auth_token, email, zipcode } = this.props;
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

    async componentDidUpdate(prevProps) {
        if (prevProps.email !== this.props.email || prevProps.zipcode !== this.props.zipcode) {
            const { auth_token, email, zipcode, openModal } = this.props;
            const loggedIn = auth_token && auth_token.length > 0;
            let channel = pusher.subscribe(`cook-${email}`);
            channel.bind('request_added', function (data) {
                
                const audio = new Audio(notificationSound);
                audio.play();
                openModal(ModalKey.REQUEST_MODAL, { ...data });
                
            });
            if (loggedIn && this.props.zipcode !== prevProps.zipcode) {
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
        const { signOut, auth_token, email, getToken, openModal, closeModal, showModal, modalKey, modalProps, changeLocation } = this.props;
        const loggedIn = auth_token && auth_token.length > 0;
        return (
            <Router>
                <Header signOut={signOut} loggedIn={loggedIn} openModal={openModal} email={email} changeLocation={changeLocation}/>
                <Route exact path="/" render={() => <Home auth_token={auth_token} email={email} openModal={openModal} closeModal={closeModal} showModal={showModal} />} />
                <Route path="/login" render={() => <Login auth_token={auth_token} email={email} getToken={getToken} openModal={openModal} closeModal={closeModal} showModal={showModal} />} />
                <Route path="/register" render={() => <Register auth_token={auth_token} email={email} getToken={getToken} />} />
                <ProtectedRoute isAllowed={loggedIn} path="/addfood" render={() => <AddFoodItem auth_token={auth_token} email={email} openModal={openModal}/>} />
                <ProtectedRoute isAllowed={loggedIn} path="/profile" render={() => <Profile auth_token={auth_token} email={email} />} />
                <Route path="/privacyPolicy" render={() => <PrivacyPolicy auth_token={auth_token} email={email} openModal={openModal} />} />
                <ProtectedRoute isAllowed={loggedIn} path="/orders" render={() => <Orders auth_token={auth_token} email={email} openModal={openModal} />} />
                <ProtectedRoute isAllowed={loggedIn} path="/homecookmenu" render={() => <MenuModal auth_token={auth_token} email={email} openModal={openModal} />} />
                <ProtectedRoute isAllowed={loggedIn} path="/homecookrequest" render={() => <Requests auth_token={auth_token} email={email} openModal={openModal}/>} />
                <MyModal {...modalProps} closeModal={closeModal} />
                {loggedIn ? <Chat auth_token={auth_token} email={email} /> : null}
            </Router>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);
