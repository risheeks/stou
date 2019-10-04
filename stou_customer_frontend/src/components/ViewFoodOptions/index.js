import React, { Component } from 'react';
import { Row, Col, Container, Button, ListGroup, FormControl, FormLabel, Image } from "react-bootstrap";
class ViewFoodOptions extends Component {
	constructor(props) {
		super(props);
		this.state = {
		  foodoptions: [ {
			chefName:'Siddhant Patel',
			description: 'yummy yummy tummy tummy',
			price: '100',
			foodName: 'Pizza taco',
			image: 'https://d1doqjmisr497k.cloudfront.net/-/media/mccormick-us/recipes/mccormick/f/800/fiesta_tacos_800x800.jpg'
		  }],
		};
	}
	render() {
	return(
	<Container>
	<ListGroup>
	{this.state.foodoptions.map(item => (
	<ListGroup.Item className="food-option">
			<div className="food-option-inner">   
				<div>
				<Image rounded className="vfo-image" src={item.image}/>
				</div>
				<div className="vfo-info">
					<div className="vfo-foodname">
					<p>{item.foodName}</p>
					</div>
					<div className="vfo-description">
					<p>{item.description}</p>
					</div>
					<div className="vfo-chefname">
					<p>{item.chefName}</p>
					</div>
				</div>
				<p className="vfo-price">${item.price}</p> 
			</div>
		</ListGroup.Item>
		))}
		<ListGroup.Item className="food-option">
		<div className="food-option-inner">   
				<div>
				<Image rounded className="vfo-image" src="https://d1doqjmisr497k.cloudfront.net/-/media/mccormick-us/recipes/mccormick/f/800/fiesta_tacos_800x800.jpg" />
				</div>
				<div className="vfo-info">
					<div className="vfo-foodname">
					<p>Chilli Tacos</p>
					</div>
					<div className="vfo-description">
					<p>Tasty texmex spicy low calorie tacosdfsdfsdfsdfsdf</p>
					</div>
					<div className="vfo-chefname">
					<p>Siddhant Patel</p>
					</div>
				</div>
				<p className="vfo-price">$10</p> 
			</div>
		</ListGroup.Item>
	</ListGroup>
	</Container>
	)
	}
	
}
export default ViewFoodOptions