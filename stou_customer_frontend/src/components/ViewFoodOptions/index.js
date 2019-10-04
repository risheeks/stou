import React from 'react'
import { Row, Col, Container, Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";

import './index.css'

const ViewFoodOptions = () => {
	return(
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