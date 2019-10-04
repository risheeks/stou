import React, { Component } from 'react';
import Login from '../Login';
import Register from '../Register';
import FilterBar from '../FilterBar';
import "../../styles/Main.css";
import ViewFoodOptions from '../ViewFoodOptions';
import ListOfHomeCooks from '../ListOfHomeCooks';
import axios from 'axios';
import { Container, ListGroup, Form, Button } from 'react-bootstrap';

export class Home extends Component {

    constructor(props){
		super(props);
		this.state = {
			zip: ""
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
            </div>
        );
    }
}

export default Home;