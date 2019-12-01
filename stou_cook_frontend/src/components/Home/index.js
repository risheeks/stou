import React, { Component } from 'react';
import Login from '../Login';
import Chat from '../Chat'
import Register from '../Register';
import OnlineStatus from '../OnlineStatus'

export class Home extends Component {

    render() {
        const { email, openModal } = this.props;

        return (
            <div className="cook-home">
                Welcome to your Homecook dashboard!
            </div>
        );
    }
}

export default Home;