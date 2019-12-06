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
import Raven from 'raven-js';

export class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            allergens: [],
            cuisines: [],
            zip: "47906",
            modalisOpen: true,
            foodoptions: []
        }

    }

    componenDidMount() {
        const data = { location: this.props.location }
        axios.post(`${serverURL}/getallfood`, { data: data })
          .then(res => {
            this.setState({
              foodoptions: Array.from(res.data.data)
            });
          })
          .catch(err => {
            Raven.captureException("GetAllFod: " + err);
            this.setState({
              foodoptions: []
            });
          })
    }

    componentDidUpdate(prevProps) {
        if(this.props.email !== prevProps.email || this.props.location !== prevProps.location) {
            const data = { location: this.props.location }
            axios.post(`${serverURL}/getallfood`, { data: data })
              .then(res => {
                this.setState({
                  foodoptions: Array.from(res.data.data)
                });
              })
              .catch(err => {
                Raven.captureException("GetAllFod: " + err);
                this.setState({
                  foodoptions: []
                });
              })
        }
    }

    onFilter = (allergens, cuisines) => {
        if (allergens.length > 0 || cuisines.length > 0) {
            const data = {
              allergens: '"' + allergens.join('", "') + '"',
              cuisines: '"' + cuisines.join('", "') + '"',
              location: this.props.location
            }
            axios.post(`${serverURL}/filter`, { data: data })
              .then(res => {
                this.setState({
                  foodoptions: Array.from(res.data.data)
                })
              })
              .catch(err => {
                Raven.captureException("Filter: " + err);
                this.setState({
                  foodoptions: []
                });
              })
          }
          else {
            const data = { location: this.props.location }
            axios.post(`${serverURL}/getallfood`, { data: data })
              .then(res => {
                this.setState({
                  foodoptions: Array.from(res.data.data)
                });
              })
              .catch(err => {
                Raven.captureException("GetAllFod: " + err);
                this.setState({
                  foodoptions: []
                });
              })
          }
    }

    render() {
        const { openModal, addToOrder, location, baggedItems, clearOrder, email } = this.props;
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
                                    foodoptions={this.state.foodoptions}
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