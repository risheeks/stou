import React, { Component } from 'react';
import { Card, Button, Image } from 'react-bootstrap';
import CustomRating from '../Common/CustomRating';
import { FaHeart, FaRegHeart } from "react-icons/fa"; 
import axios from 'axios';
import { serverURL } from '../../config';

class FavoriteHomeCook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFavoriteHomeCook : true,
		};
    }

   
    ChangeSaveFavHomeCookStatus =(e)=> {
  		const currentFavHomeCookStatus=this.state.isFavoriteHomeCook;
  		this.setState({
  			isFavoriteHomeCook: !currentFavHomeCookStatus
  		})
  		console.log("status: ", !currentFavHomeCookStatus);
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
                <Card.Img variant="top" src={picture} style={{maxHeight: '200px'}} />
                <Card.Body>
                    <Card.Title>{name}</Card.Title>
                    <Card.Text>
                        {/* {description} */}
                        I love cooking
                    </Card.Text>
                    <CustomRating rating={rating} readonly={true} />
                    <Button  variant="link">View Menu</Button>
                </Card.Body>
            </Card>
        );
    }
}

export default FavoriteHomeCook;