import React, { Component } from 'react';
import Login from '../Login';
import Register from '../Register';
import FilterBar from '../FilterBar';
import "../../styles/Main.css";
import ViewFoodOptions from '../ViewFoodOptions';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import ListOfHomeCooks from '../ListofHomeCooks';


export class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            allergens: [],
            cuisines: [],
            zip: ''
        }
    }

    sendLocation = e => {
		e.preventDefault();
		axios.post("http://192.168.43.177:300/updateZip",{
			params: {
				zip: this.state.zip
			}
		})
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
                <div className="location-zipcode">
                    <Form>
                        <Form.Group controlId="formGroupEmail">
                            <Form.Label>Location</Form.Label>
                            <Form.Control type="email" placeholder="Enter zipcode" />
                        </Form.Group>
                       </Form>
                    <Button
                        block
                        bsSize="large"
                        className="submit-button"
                        onClick={this.sendLocation}>
                        Submit
                        </Button>
                </div>
                <div className="homec">
                <FilterBar onFilter={this.onFilter} />
                <div className="homec">
                        <div className="home">
                            <h5>Food Available</h5>
                            <ViewFoodOptions allergens={this.state.allergens} cuisines={this.state.cuisines} />
                        </div>
                        <div className="home">
                            <h5>Home Cooks</h5>
                            <ListOfHomeCooks/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;