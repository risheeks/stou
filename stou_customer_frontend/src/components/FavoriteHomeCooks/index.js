import React, { Component } from 'react';
import ImageOfCook from '../../constants/images/full_white_logo.png';
import { Row, Col, Container, Button, ListGroup, FormControl, FormLabel, Image } from "react-bootstrap";
import FavoriteHomeCook from './favoriteHomecooks';
import axios from 'axios';
import { serverURL } from '../../config';

class FavoriteHomeCooksList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			favHomecooks: []
		};
		//console.log(this.props.email)
	}

	getFavHomecooks = () => {

		// let data = { email: this.props.email }
        axios.post(`${serverURL}/getfavoritehomecooks`, { 
			data: {
				email:this.props.email,
			}
		})
            .then(res => {
                console.log(res.data)
                this.setState({
                    favhomecooks: Array.from(res.data)
                });
			});
		//console.log(this.state.favhomecooks)
	}

	componentDidMount() {
		this.getFavHomecooks();
		return;
	}

	// getHomecooks = () => {
    //     axios.get(`${serverURL}/gethomecooks?location=47906`)
    //         .then(res => {
    //             console.log(res.data)
    //             console.log(Array.from(res.data.data))
    //             this.setState({
    //                 favHomecooks: Array.from(res.data.data)
    //             });
    //         });
    // }

	render() {
		return (
			<Container className="homecook-container">
					{this.state.favHomecooks.map(item => (
						<FavoriteHomeCook 
							name={item.name}
							picture={item.picture}
							description={item.description}
							rating={3.5}
						/>
					))}
			</Container>
		)
	}

}
export default FavoriteHomeCooksList;