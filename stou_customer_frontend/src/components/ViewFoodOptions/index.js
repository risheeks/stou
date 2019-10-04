import React from 'react'
import { Row, Col, Container, Button, ListGroup, FormControl, FormLabel, Image } from "react-bootstrap";
const ViewFoodOptions = () => {
	return(
	<Container className="ViewFoodOptions">
	<ListGroup>
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
					<p>Tasty texmex spicy low calorie taco</p>
					</div>
					<div className="vfo-chefname">
					<p>Siddhant Patel</p>
					</div>
				</div>
				<p className="vfo-price">$10</p> 
			</div>
		</ListGroup.Item>
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
					<p>Tasty texmex spicy low calorie taco</p>
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
export default ViewFoodOptions