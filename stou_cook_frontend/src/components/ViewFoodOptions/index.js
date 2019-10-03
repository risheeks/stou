import React from 'react'
import { Row, Col, Container, Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";

import './index.css'

const ViewFoodOptions = () => {
	return(
		// <div className = 'homecookContainer'> 
		// 	<h2>List of food </h2>
		// 	<ul>
		// 		<li>
		// 			<div className = 'subContainer float-my-children'>	
		// 				{/* <img src="https://cdn2.lamag.com/wp-content/uploads/sites/6/2019/03/C19_Kogi_Tacos-1000x667.jpg"alt=""></img> */}
		// 				<div>
		// 					<h3>Aunt May</h3>
		// 					<p>Burgers, American, Sandwiches, Fast Food, BBQ, urgers, American, Sandwiches...</p>
		// 					<p>Min $ 10.00</p>
		// 				</div>
		// 				<div className="rating_container">
		// 					<fieldset className="rating">
		// 				    <input type="radio" id="star5" name="rating" value="5" /><label class = "full" for="star5" title="Awesome - 5 stars"></label>
		// 				    <input type="radio" id="star4half" name="rating" value="4 and a half" /><label class="half" for="star4half" title="Pretty good - 4.5 stars"></label>
		// 				    <input type="radio" id="star4" name="rating" value="4" /><label class = "full" for="star4" title="Pretty good - 4 stars"></label>
		// 				    <input type="radio" id="star3half" name="rating" value="3 and a half" /><label class="half" for="star3half" title="Okay - 3.5 stars"></label>
		// 				    <input type="radio" id="star3" name="rating" value="3" /><label class = "full" for="star3" title="Okay - 3 stars"></label>
		// 				    <input type="radio" id="star2half" name="rating" value="2 and a half" /><label class="half" for="star2half" title="Meh - 2.5 stars"></label>
		// 				    <input type="radio" id="star2" name="rating" value="2" /><label class = "full" for="star2" title="Meh - 2 stars"></label>
		// 				    <input type="radio" id="star1half" name="rating" value="1 and a half" /><label class="half" for="star1half" title="Meh - 1.5 stars"></label>
		// 				    <input type="radio" id="star1" name="rating" value="1" /><label class = "full" for="star1" title="Sucks big time - 1 star"></label>
		// 				    <input type="radio" id="starhalf" name="rating" value="half" /><label class="half" for="starhalf" title="My dog can cook better - 0.5 stars"></label>
		// 					</fieldset>
		// 					<p>245 Reviews</p>								
		// 					<button class="buttonViewMenu">View Menu</button>
		// 				</div>
		// 			</div>
		// 		</li>
				
		// 	</ul>
        // </div>
    <Container className="ViewFoodOptions">
        <Row>
            <Col>   
            <img className="vfo-image rounded float-left" src="https://d1doqjmisr497k.cloudfront.net/-/media/mccormick-us/recipes/mccormick/f/800/fiesta_tacos_800x800.jpg" alr=""></img>
            </Col>
            <Col>  
                <Row className="vfo-chefname">
                <p>Siddhant Patel</p>
                </Row>
                <Row className="vfo-description">
                <p>tasty italian food lolololololololol</p>
                </Row>
            </Col>
            <Col className="vfo-price">  
            $$ 10
            </Col>
        </Row>
    </Container>
	)
	
}
export default ViewFoodOptions