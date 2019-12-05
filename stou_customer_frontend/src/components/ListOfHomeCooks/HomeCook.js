import React, { Component } from 'react';
import { Card, Button, Image } from 'react-bootstrap';
import CustomRating from '../Common/CustomRating';
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { IoMdEye } from "react-icons/io"
import axios from 'axios';
import { serverURL } from '../../config';
import { ModalKey } from '../../constants/ModalKeys';

class HomeCook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFavoriteHomeCook : false,
            cook_email: this.props.cook_email,
            fooditems:[],
            views: 0
		};
    }
    componentDidMount = () => {
        this.setState({isFavoriteHomeCook : this.props.isFav})
        this.axiosGetViews(this.state.cook_email);
    }

    ChangeSaveFavHomeCookStatus =(e)=> {
        const currentFavHomeCookStatus=this.state.isFavoriteHomeCook;
        this.setState({
            isFavoriteHomeCook: !currentFavHomeCookStatus
        })
        if(!currentFavHomeCookStatus) {
            this.AddFavoriteHomeCook()
        }
        else {
            this.RemoveFavoriteHomeCook() 
        }
        //console.log("status: ", !currentFavHomeCookStatus);
        //console.log(this.props.cook_email);
    }
    AddFavoriteHomeCook =(e) => {
        axios.post(`${serverURL}/setfavoritehomecooks`, {
            data: {
                email: this.props.email,
                cook_email: this.state.cook_email
            }
        })
        .then(res => {
            
        })
    }

    RemoveFavoriteHomeCook =(e) => {
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
    }

    clickMenu = e => {
        e.preventDefault()
        const self = this;
        axios.post(`${serverURL}/getfooditems`, { 
            data: {
                email:this.state.cook_email,
            }
        })
        .then(res => {
            //console.log(res.data)
            this.setState({
                fooditems: Array.from(res.data.data)
            });
            const { openModal, addToOrder, name, clearOrder, baggedItems } = this.props;
            const {fooditems} = this.state
            
            openModal(ModalKey.MENU, {fooditems,addToOrder,openModal, name, baggedItems: baggedItems, clearOrder: clearOrder, customerEmail: this.props.email, cookEmail: this.state.cook_email});
            //console.log(this.state.fooditems)   
            
        }).catch(function (error) {
            const { openModal, name} = self.props;
            openModal(ModalKey.MENU, {openModal, name, customerEmail: this.props.email, cookEmail: this.state.cook_email});
        });
    }

    clickProfile = e => {
        const { name, description, picture, rating, openModal, cook_email} = this.props;
        //console.log(this.props);
        this.state.views = this.state.views + 1;
        this.axiosCall(this.state.views);
        openModal(ModalKey.PROFILE, {name, description, picture, rating,cook_email});
    }


    axiosGetViews = (email) => {
        axios.post(`${serverURL}/getviews`, {
            data: {
                cookEmail: this.props.cook_email,
            }
        })
            .then(res => {
                this.setState({
                    views : res.data.data
                });
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
    }

    render() {
        const { name, description, picture, rating } = this.props;

        return (
            <Card className="homecook-card" style={{ width: '18rem' }}>

                <div onClick={this.ChangeSaveFavHomeCookStatus} style={{display: this.state.isFavoriteHomeCook ? 'none' : 'block' }}>
                    <div>
                    <i className="eyeViews-text"><IoMdEye className="eyeViews"/>{this.state.views} Views</i>
                     </div>
                	<i><FaRegHeart className="saveOpenHeart"/></i>
                </div>
                <div onClick={this.ChangeSaveFavHomeCookStatus} style={{display: this.state.isFavoriteHomeCook ? 'block' : 'none' }}>
                	<i><FaHeart className="saveHeart"/></i>
                </div>

                <Card.Body><Card.Img className="cook-image" variant="top" src={picture} onClick={this.clickProfile} style={{maxHeight: '200px'}} />

        <Card.Title className="wrapped-cook-text"><b>{name}</b></Card.Title>
                    <br/>
                    <Card.Text className="text-about-me-label wrapped-cook-text">
                        {description}
                    </Card.Text>
                    <CustomRating rating={rating} readonly={true} bowlSize="30px"/>
                    <Button  variant="link" onClick={this.clickMenu}>View Menu</Button>
                </Card.Body>
            </Card>
        );
    }
}

export default HomeCook;