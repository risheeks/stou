import React, { Component } from 'react';
import ImageOfCook from '../../constants/images/full_red_logo.png';
import './index.css';
import { Row, Col, Container, Button, ListGroup, FormControl, FormLabel, Image } from "react-bootstrap";
import HomeCook from './HomeCook';

class ListOfHomeCooks extends Component {
	constructor(props) {
		super(props);
		this.state = {
			homecooks: [
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
	render() {
		return (
			<Container className="homecook-container">
					{this.state.homecooks.map(item => (
						<HomeCook
							name={item.name}
							picture={item.picture}
							description={item.description}
						/>
					))}
			</Container>
		)
	}

}
export default ListOfHomeCooks