import React, { Component } from 'react';
import UserList from '../UserList';

class Home extends Component {
    render() {
        const { auth_token, email, openModal } = this.props;
        return (
            <div>
                <UserList openModal={openModal} />
            </div>
        );
    }
}

export default Home;
