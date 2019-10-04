import React, { Component } from 'react';
import Login from '../Login';
import Register from '../Register';
import FilterBar from '../FilterBar';
import "../../styles/Main.css";
import ViewFoodOptions from '../ViewFoodOptions';
import ListOfHomeCooks from '../ListOfHomeCooks';
import { Container, ListGroup } from 'react-bootstrap';

export class Home extends Component {
    render() {
        return (
            <div className="homec">
                <FilterBar />
                <div className="homec">
                    <div className="home">
                        <h5>Food Available</h5>
                        <ViewFoodOptions/>
                    </div>
                    <div className="home">
                        <h5>Home Cooks</h5>
                        <ListOfHomeCooks/>
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;