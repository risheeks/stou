import React, { Component } from 'react';
// import image from '../../constants/images/stoulogo.png';
import './index.css';
import { Row, Col, Container, Button, ListGroup, FormControl, FormLabel, Image } from "react-bootstrap";
import ImageOfCook from '../../constants/images/wineandcode.png';


// export class ListOfHomeCooks extends Component {
// 	constructor(props) {
// 		super(props);

// 		this.state = {
// 			homecooks: [
// 				{
// 					picture: null,
// 					name: "",
// 					cuisineList: "",
// 					email: ""
// 				}
// 			]
// 		};
// 	}
//   	render(){
// 		return(
// 			<Container className = 'homecookContainer'> 
// 				<ListGroup>
// 					{this.state.homecooks.map(cook => (
// 					<ListGroup.item>
// 						<div className = 'subContainer float-my-children'>	
// 							<div>
// 								<Image src={cook.picture} alt=""></Image>
// 							</div>
// 							<div>
// 								<h3>{cook.name}</h3>
// 								<p>{cook.cuisineList}</p>
// 							</div>
// 							<div className="rating_container">								
// 								<Button class="buttonViewMenu">View Menu</Button>
// 							</div>
// 						</div>
// 					</ListGroup.item>
// 				))}
// 				</ListGroup>
// 				{/* <ListGroup.item>
// 						<div className = 'subContainer float-my-children'>	
// 							<Image src={ImageOfCook} alt=""></Image>
// 							<div>
// 								<h3>Akshay</h3>
// 								<p>Indian</p>
// 							</div>
// 							<div className="rating_container">								
// 								<Button class="buttonViewMenu">View Menu</Button>
// 							</div>
// 						</div>
// 					</ListGroup.item> */}
// 			</Container>
// 		)
// 	}
// }
// export default ListOfHomeCooks;


// import React, { Component } from 'react';
// import { Row, Col, Container, Button, ListGroup, FormControl, FormLabel, Image } from "react-bootstrap";

class ListOfHomeCooks extends Component {
	constructor(props) {
		super(props);
		this.state = {
			homecooks: [
								{
									picture: ImageOfCook,
									name: "Adrian",
									cuisineList: "Italian",
									email: "",
									menu: []
								}
							]
		};
	}
	render() {
	return(
	<Container className="homecookContainer">
	<ListGroup>
	{this.state.homecooks.map(item => (
		<ListGroup.Item className="food-option">
		<div className="food-option-inner">   
			<div>
				<Image rounded className="vfo-image" src={item.picture}/>
			</div>
			<div className="vfo-info cook-item">
				<h5>{item.name}</h5>
				<p>{item.cuisineList}</p>
			</div>
			<div className="rating_container cook-item">								
				<Button class="buttonViewMenu">View Menu</Button>
			</div>
		</div>
	</ListGroup.Item>
		))}
		<ListGroup.Item className="food-option">
			<div className="food-option-inner">   
				<div>
					<Image rounded className="vfo-image" src={ImageOfCook}/>
				</div>
				<div className="vfo-info cook-item">
					<h5>Akshay</h5>
					<p>Indian</p>
				</div>
				<div className="rating_container cook-item">								
					<Button class="buttonViewMenu">View Menu</Button>
				</div>
			</div>
		</ListGroup.Item>
	</ListGroup>
	</Container>
	)
	}
	
}
export default ListOfHomeCooks