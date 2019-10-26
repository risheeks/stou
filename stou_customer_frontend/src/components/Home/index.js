import React, { Component } from 'react';
import Login from '../Login';
import Register from '../Register';
import FilterBar from '../FilterBar';
import "../../styles/Main.css";
import ViewFoodOptions from '../ViewFoodOptions';
import ListOfHomeCooks from '../ListOfHomeCooks';
import axios from 'axios';
import { serverURL } from '../../config';
import { Container, ListGroup, Form, Button, Modal, Tabs, Tab } from 'react-bootstrap';
import { ModalKey } from '../../constants/ModalKeys';

export class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            allergens: [],
            cuisines: [],
            zip: "47906",
            modalisOpen: true
        }

    }

    /*componentDidMount() {
        this.props.openModal(ModalKey.ZIPCODE);
    }*/

    sendLocation = e => {
        e.preventDefault();
        axios.post(`${serverURL}/location`, {
            params: {
                location: this.state.zip
            }
        })
            .then(res => {
                this.setState({ modalisOpen: false })
                this.getLocation();
            })
    }

    onFilter = (allergens, cuisines) => {
        this.setState({
            allergens: allergens,
            cuisines: cuisines
        })
    }

    render() {
        const { openModal, addToOrder} = this.props;
        return (
            <div className="home">
                <Tabs defaultActiveKey="food" id="uncontrolled-tab-example">
                    <Tab eventKey="food" title="Food">
                        <div className="homec">
                            <FilterBar onFilter={this.onFilter} />
                            <ViewFoodOptions
                                allergens={this.state.allergens}
                                cuisines={this.state.cuisines}
                                openModal={openModal}
                                addToOrder={addToOrder}
                            />
                        </div>
                    </Tab>
                    <Tab eventKey="cooks" title="Homecooks">
                        <div className="homec">
                            <ListOfHomeCooks />
                        </div>
                    </Tab>
                </Tabs>
                
            </div>
        );
    }
}

export default Home;