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
import { ROLE } from '../../constants';
import RecentOrders from '../RecentOrders';

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

    onFilter = (allergens, cuisines) => {
        this.setState({
            allergens: allergens,
            cuisines: cuisines
        })
    }

    render() {
        const { openModal, addToOrder, location, baggedItems, clearOrder, email } = this.props;
        //console.log(location)
        return (
            <div className="master-container">
                <div className="home">
                    <RecentOrders openModal={openModal} email={email} />
                    <Tabs defaultActiveKey="food" id="uncontrolled-tab-example">
                        <Tab eventKey="food" title="Food">
                            <div className="homec">
                                <FilterBar onFilter={this.onFilter} />
                                <ViewFoodOptions
                                    allergens={this.state.allergens}
                                    cuisines={this.state.cuisines}
                                    openModal={openModal}
                                    addToOrder={addToOrder}
                                    location={location}
                                    baggedItems={baggedItems}
                                    clearOrder={clearOrder}
                                />
                            </div>
                        </Tab>
                        <Tab eventKey="cooks" title="Homecooks">
                            <div className="homec">
                                <ListOfHomeCooks clearOrder={clearOrder} baggedItems={baggedItems} location={location} addToOrder={addToOrder} email={this.props.email} openModal={openModal} />
                            </div>
                        </Tab>
                    </Tabs>
                </div>
            </div>
        );
    }
}

export default Home;