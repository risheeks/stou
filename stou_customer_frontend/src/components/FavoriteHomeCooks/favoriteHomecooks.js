import React, { Component } from 'react';
import { Card, Button, Image } from 'react-bootstrap';
import CustomRating from '../Common/CustomRating';
import { FaHeart, FaRegHeart } from "react-icons/fa"; 
import axios from 'axios';
import { serverURL } from '../../config';
import { ModalKey } from '../../constants/ModalKeys';

class FavoriteHomeCook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFavoriteHomeCook : true,
		};
    }

    clickProfile = e => {
        const { name, description, picture, rating, openModal } = this.props;
        openModal(ModalKey.PROFILE, {name, description, picture, rating});
    }

    RemoveFavoriteHomeCook =(e) => {
        //console.log(this.props.email + " " + this.props.cook_email);
        axios.post(`${serverURL}/removefavoritehomecooks`, {
            data: {
                customerEmail: this.props.email,
                cookEmail: this.props.cook_email
            }
        })
        .then(res => {
            console.log(res.data);
        })
        // window.location.reload();
    }

   
    ChangeSaveFavHomeCookStatus =(e)=> {
  		const currentFavHomeCookStatus=this.state.isFavoriteHomeCook;
  		this.setState({
  			isFavoriteHomeCook: !currentFavHomeCookStatus
  		})
        console.log("status: ", !currentFavHomeCookStatus);
        if(currentFavHomeCookStatus) {
            this.RemoveFavoriteHomeCook();
        }
  	}

    render() {
        const { name, description, picture, rating } = this.props;
        console.log(name + " " + rating);

        return (
            <Card className="homecook-card" style={{ width: '18rem' }}>
                
                <div onClick={this.ChangeSaveFavHomeCookStatus} style={{display: this.state.isFavoriteHomeCook ? 'none' : 'block' }}>
                	<i><FaRegHeart className="saveOpenHeart"/></i> 
                </div>
                <div onClick={this.ChangeSaveFavHomeCookStatus} style={{display: this.state.isFavoriteHomeCook ? 'block' : 'none' }}>
                	<i><FaHeart className="saveHeart"/></i>
                </div>
                <Card.Img class="cook-image" variant="top" src={picture} style={{maxHeight: '200px'}} onClick={this.clickProfile}/>
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

export default FavoriteHomeCook;