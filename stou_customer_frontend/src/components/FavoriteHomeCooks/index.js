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
			favhomecooks: []
		};
	}

	getFavHomecooks = () => {

		axios.post(`${serverURL}/getfavoritehomecooks`, {
			data: {
				email: this.props.email,
			}
		})
			.then(res => {
				console.log(res.data)
				this.setState({
					favhomecooks: Array.from(res.data)
				});
			});
		console.log(this.state.favhomecooks)
	}

	componentDidMount() {
		this.getFavHomecooks();
	}

	componentDidUpdate(prevProps) {
		if(prevProps.email !== this.props.email) {
			this.getFavHomecooks();
		}
	}

	render() {
		return (
			<Container className="master-container">
					<div className="orders-container">
						<p className="page-title"><b>Your Favorite Homecooks</b></p>
					</div>
					<Container className="homecook-container">
					{this.state.favhomecooks.map(item => (
						<FavoriteHomeCook
							openModal={this.props.openModal}
							email={this.props.email}
							cook_email={item.email}
							name={item.cook_name}
							picture={item.cook_picture}
							description={item.cook_description}
							rating={item.rating}
						/>
					))}
				</Container>
			</Container>
		)
	}

}
export default FavoriteHomeCooksList;