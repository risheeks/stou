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
			favHomecooks: [
				{
					picture: ImageOfCook,
					name: "Adrian",
					cuisineList: "Italian",
					description: "This is just a random description",
					email: "",
					menu: []
				},
				{
					picture: ImageOfCook,
					name: "Adrian",
					cuisineList: "Italian",
					description: "This is just a random description",
					email: "",
					menu: []
				},
				{
					picture: ImageOfCook,
					name: "Adrian",
					cuisineList: "Italian",
					description: "This is just a random description",
					email: "",
					menu: []
				}
				
			]
		};
	}

	componentDidMount() {
		//this.getHomecooks();
		return;
	}

	getHomecooks = () => {
        axios.get(`${serverURL}/gethomecooks?location=47906`)
            .then(res => {
                console.log(res.data)
                console.log(Array.from(res.data.data))
                this.setState({
                    favHomecooks: Array.from(res.data.data)
                });
            });
    }

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