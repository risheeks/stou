import React, { Component } from 'react';
import Login from '../Login';
import Register from '../Register';
import FilterBar from '../FilterBar';
import "../../styles/Main.css";
import ViewFoodOptions from '../ViewFoodOptions';

export class Home extends Component {
    render() {
        return (
            <div className="home">
                <FilterBar />
                <ViewFoodOptions/>
            </div>
        );
    }
}

export default Home;