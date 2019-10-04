import React, { Component } from 'react';
import Login from '../Login';
import Register from '../Register';
import FilterBar from '../FilterBar';

export class Home extends Component {
    render() {
        return (
            <div>
                <FilterBar />
            </div>
        );
    }
}

export default Home;