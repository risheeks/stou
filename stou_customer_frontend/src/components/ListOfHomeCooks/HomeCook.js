import React, { Component } from 'react';
import { Card, Button, Image } from 'react-bootstrap';
import CustomRating from '../Common/CustomRating';
import { FaHeart, FaRegHeart } from "react-icons/fa"; 
import axios from 'axios';
import { serverURL } from '../../config';

class HomeCook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFavoriteHomeCook : false,
            cook_email: this.props.cook_email
		};
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
        console.log("status: ", !currentFavHomeCookStatus);
        console.log(this.props.cook_email);
    }
    AddFavoriteHomeCook =(e) => {
        console.log(this.props.email + " " + this.state.cook_email);
        axios.post(`${serverURL}/setfavoritehomecooks`, {
            data: {
                email: this.props.email,
                cook_email: this.state.cook_email
            }
        })
        .then(res => {
            console.log(res.data);
        })
    }

    RemoveFavoriteHomeCook =(e) => {
        console.log(this.props.email + " " + this.state.cook_email);
        axios.post(`${serverURL}/removefavoritehomecooks`, {
            data: {
                customerEmail: this.props.email,
                cookEmail: this.state.cook_email
            }
        })
        .then(res => {
            console.log("Reached remove")
            console.log(res.data);
        })
    }


    render() {
        const { name, description, picture, rating } = this.props;

        return (
            <Card className="homecook-card" style={{ width: '18rem' }}>
                <div onClick={this.ChangeSaveFavHomeCookStatus} style={{display: this.state.isFavoriteHomeCook ? 'none' : 'block' }}>
                	<i><FaRegHeart className="saveOpenHeart"/></i> 
                </div>
                <div onClick={this.ChangeSaveFavHomeCookStatus} style={{display: this.state.isFavoriteHomeCook ? 'block' : 'none' }}>
                	<i><FaHeart className="saveHeart"/></i>
                </div>
                <Card.Img class="cook-image" variant="top" src={picture} style={{maxHeight: '200px'}} />
                
                <Card.Body>
                    <Card.Title class="wrapped-cook-text"><b>{name}</b></Card.Title>
                    <br/>
                    <Card.Text class="text-about-me-label wrapped-cook-text">
                        {description}
                    </Card.Text>
                    <CustomRating rating={rating} readonly={true} />
                    <Button  variant="link">View Menu</Button>
                </Card.Body>
            </Card>
        );
    }
}

export default HomeCook;