import React, { Component } from 'react';
import Login from '../Login';
import Register from '../Register';
import FilterBar from '../FilterBar';
import "../../styles/Main.css";
import ViewFoodOptions from '../ViewFoodOptions';

export class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            allergens: [],
            cuisines: []
        }
    }

    onFilter = (allergens, cuisines) => {
        this.setState({
            allergens: allergens,
            cuisines: cuisines
        })
    }

    render() {
        return (
            <div className="home">
                <FilterBar onFilter={this.onFilter} />
                <ViewFoodOptions allergens={this.state.allergens} cuisines={this.state.cuisines} />
            </div>
        );
    }
}

export default Home;