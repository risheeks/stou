import React, { Component } from 'react';
import Login from '../Login';
import Register from '../Register';
import OnlineStatus from '../OnlineStatus'

export class Home extends Component {
    render() {
        return (
            <div>
                <OnlineStatus email={this.props.email}/>
                <h1>THIS IS HOME</h1>
				
            </div>
        );
    }
}

export default Home;