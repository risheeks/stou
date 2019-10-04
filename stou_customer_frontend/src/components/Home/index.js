import React, { Component } from 'react';
import Login from '../Login';
import Register from '../Register';
import FilterBar from '../FilterBar';
import "../../styles/Main.css";
import ViewFoodOptions from '../ViewFoodOptions';
import ListOfHomeCooks from '../ListOfHomeCooks';
import axios from 'axios';
import { serverURL } from '../../config';
import { Container, ListGroup, Form, Button, Modal } from 'react-bootstrap';

export class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            zip: "47906",
            modalisOpen: true
        }

    }
    sendLocation = e => {
        e.preventDefault();
        axios.post("/setlochttp://192.168.43.177:3000/location", {
            params: {
                location: this.state.zip
            }
        })
            .then(res => {
                this.setState({ modalisOpen: false })
                this.getLocation();
            })
    }

    cancel = e => {
        this.setState({modalisOpen: false});
    }

    getLocation = e => {
        // console.log(${serverURL});
        axios.get("/setlochttp://192.168.43.177:3000/gethomecooks", {
            params: {
                location: this.state.zip
            }
        })
            .then(res => {
                console.log(res.data)
                console.log(Array.from(res.data.data))
                this.setState({
                    homecooks: Array.from(res.data.data)
                });
            });
    }


    render() {
        return (
            <div className="home">
                <Modal show={this.state.modalisOpen} onHide={this.handleClose}>
                    <div className="location-zipcode">
                        <Form>
                            <Form.Group controlId="formGroupEmail">
                                <Form.Label>Location</Form.Label>
                                <Form.Control type="email" placeholder="Enter zipcode" />
                            </Form.Group>
                        </Form>
                        <div className='homec'>
                        <Button
                            block
                            bsSize="large"
                            type='submit'
                            className="submit-button"
                            onClick={this.sendLocation}>
                            Submit
                        </Button>
                        <Button
                            block
                            bsSize="large"
                            className="cancel-button"
                            onClick={this.cancel}>
                            Cancel
                        </Button>
                        </div>
                    </div>
                </Modal>
                <div className="homec">

                    <FilterBar />
                    <div className="homec">
                        <div className="home">
                            <h5>Food Available</h5>
                            <ViewFoodOptions />
                        </div>
                        <div className="home">
                            <h5>Home Cooks</h5>
                            <ListOfHomeCooks />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;