import React, { Component } from 'react';
import Login from '../Login';
import Register from '../Register';
import OnlineStatus from '../OnlineStatus'

export class Home extends Component {

    render() {
        const { email, openModal } = this.props;

        return (
            <div>
                <OnlineStatus
                    email={this.props.email}
                    openModal={openModal}
                />
            </div>
        );
    }
}

export default Home;