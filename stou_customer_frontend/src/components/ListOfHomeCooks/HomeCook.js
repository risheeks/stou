import React, { Component } from 'react';
import { Card, Button, Image } from 'react-bootstrap';
import CustomRating from '../Common/CustomRating';
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { IoMdEye } from "react-icons/io"
import axios from 'axios';
import { serverURL } from '../../config';
import { ModalKey } from '../../constants/ModalKeys';
import Raven from 'raven-js';

class HomeCook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFavoriteHomeCook: false,
            cook_email: this.props.cook_email,
            fooditems: [],
            views: this.props.numViews
        };
    }
    componentDidMount = () => {
        this.setState({ isFavoriteHomeCook: this.props.isFav })
        //this.axiosGetViews(this.state.cook_email);
    }

    ChangeSaveFavHomeCookStatus = (e) => {
        const currentFavHomeCookStatus = this.state.isFavoriteHomeCook;
        this.setState({
            isFavoriteHomeCook: !currentFavHomeCookStatus
        })
        if (!currentFavHomeCookStatus) {
            this.AddFavoriteHomeCook()
        }
        else {
            this.RemoveFavoriteHomeCook()
        }
        //console.log("status: ", !currentFavHomeCookStatus);
        //console.log(this.props.cook_email);
    }
    AddFavoriteHomeCook = (e) => {
        axios.post(`${serverURL}/setfavoritehomecooks`, {
            data: {
                email: this.props.email,
                cook_email: this.state.cook_email
            }
        })
            .then(res => {

            })
            .catch(err => {
                Raven.captureException("SetFavHomeCooks: " + err);
            })
    }

    RemoveFavoriteHomeCook = (e) => {
        axios.post(`${serverURL}/removefavoritehomecooks`, {
            data: {
                customerEmail: this.props.email,
                cookEmail: this.state.cook_email
            }
        })
            .then(res => {
                //console.log("Reached remove")
                //console.log(res.data);
            })
            .catch(err => {
                Raven.captureException("RemoveFavHomeCook: " + err);
            })
    }

    topPastFood = () => {
        axios.post(`${serverURL}/gettopfood`, {
            data: {
                cookEmail: this.state.cook_email,
            }
        })
            .then(res => {
                console.log(res.data.data)
                this.setState({
                    topFood: res.data.data
                });
                //console.log("TOP FOOD=" + this.state.topFood)

            }).catch(function (error) {
                Raven.captureException("GetTopFood: " + error);
                this.setState({
                    topFood: null
                })
            });
    }

    clickMenu = e => {
        e.preventDefault()
        const self = this;
        axios.post(`${serverURL}/getfooditems`, {
            data: {
                email: this.state.cook_email,
            }
        })
            .then(res => {
                self.setState({
                    fooditems: Array.from(res.data.data)
                });
                axios.post(`${serverURL}/gettopfood`, {
                    data: {
                        cookEmail: this.state.cook_email,
                    }
                })
                    .then(res => {
                        console.log(res.data.data)
                        self.setState({
                            topFood: res.data.data
                        });
                        const { openModal, addToOrder, name, clearOrder, baggedItems } = self.props;
                        const { fooditems } = self.state

                        openModal(ModalKey.MENU, { fooditems, addToOrder, openModal, name, baggedItems: baggedItems, topFood: res.data.data, clearOrder: clearOrder, customerEmail: self.props.email, cookEmail: self.state.cook_email });

                    }).catch(function (error) {
                        Raven.captureException("GetTopFood: " + error);
                        const { openModal, addToOrder, name, clearOrder, baggedItems } = self.props;
                        const { fooditems } = self.state
                        openModal(ModalKey.MENU, { fooditems, addToOrder, openModal, name, baggedItems: baggedItems, topFood: null, clearOrder: clearOrder, customerEmail: self.props.email, cookEmail: self.state.cook_email });
                    });


                //console.log(this.state.fooditems)   

            }).catch(function (error) {
                Raven.captureException("GetFoodItems: " + error);
                const { openModal, name } = self.props;
                openModal(ModalKey.MENU, { openModal, name, customerEmail: this.props.email, cookEmail: this.state.cook_email });
            });
    }

    clickProfile = e => {
        const { name, description, picture, rating, openModal, cook_email } = this.props;
        //console.log(this.props);
        this.state.views = this.state.views + 1;
        this.axiosCall(this.state.views);
        openModal(ModalKey.PROFILE, { name, description, picture, rating, cook_email });
    }


    axiosGetViews = (email) => {
        axios.post(`${serverURL}/getviews`, {
            data: {
                cookEmail: this.props.cook_email,
            }
        })
            .then(res => {
                let numviews = 0
                if (res.data.data !== null) {
                    numviews = res.data.data;
                }
                this.setState({
                    views: numviews
                });
            })
            .catch(err => {
                Raven.captureException("GetViews: " + err);
            })

    }
    axiosCall = (views) => {
        axios.post(`${serverURL}/setViews`, {
            data: {
                cookEmail: this.props.cook_email,
                numViews: views
            }
        })
            .then(res => {

            })
            .catch(err => {
                Raven.captureException("SetViews: " + err);
            })
    }

    render() {
        const { name, description, picture, rating } = this.props;
        console.log(this.state.isFavoriteHomeCook)
        return (
            <Card className="homecook-card" style={{ width: '18rem' }}>

                <div>
                    <div>
                        <i className="eyeViews-text"><IoMdEye className="eyeViews" />{this.state.views} Views</i>
                    </div>
                    {this.state.isFavoriteHomeCook ?
                        <i onClick={this.ChangeSaveFavHomeCookStatus}><FaHeart className="saveHeart" /></i> :
                        <i onClick={this.ChangeSaveFavHomeCookStatus}><FaRegHeart className="saveOpenHeart" /></i>
                    }
                </div>
                <Card.Body><Card.Img className="cook-image" variant="top" src={picture} onClick={this.clickProfile} style={{ maxHeight: '200px' }} />

                    <Card.Title className="wrapped-cook-text"><b>{name}</b></Card.Title>
                    <br />
                    <Card.Text className="text-about-me-label wrapped-cook-text">
                        {description}
                    </Card.Text>
                    <CustomRating rating={rating} readonly={true} bowlSize="30px" />
                    <Button variant="link" onClick={this.clickMenu}>View Menu</Button>
                </Card.Body>
            </Card>
        );
    }
}

export default HomeCook;