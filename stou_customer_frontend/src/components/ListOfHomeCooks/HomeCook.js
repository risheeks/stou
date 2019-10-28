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
            this.updateFavoriteHomeCooks()
        }
        console.log("status: ", !currentFavHomeCookStatus);
        console.log(this.props.cook_email);
    }
    updateFavoriteHomeCooks =(e) => {
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

    render() {
        const { name, description, picture, rating } = this.props;

        return (
            <Card className="homecook-card" style={{ width: '18rem' }}>
                <Card.Img variant="top" src={picture} style={{maxHeight: '200px'}} />
                <div onClick={this.ChangeSaveFavHomeCookStatus} style={{display: this.state.isFavoriteHomeCook ? 'none' : 'block' }}>
                	<i><FaRegHeart className="saveOpenHeart"/></i> 
                </div>
                <div onClick={this.ChangeSaveFavHomeCookStatus} style={{display: this.state.isFavoriteHomeCook ? 'block' : 'none' }}>
                	<i><FaHeart className="saveHeart"/></i>
                </div>
                <Card.Body>
                    <Card.Title>{name}</Card.Title>
                    <Card.Text>
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