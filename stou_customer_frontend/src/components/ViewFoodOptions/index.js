import React, { Component } from 'react';
import { Row, Col, Container, Button, ListGroup, FormControl, FormLabel, Image } from "react-bootstrap";
import axios from 'axios';
import { serverURL } from '../../config';

class ViewFoodOptions extends Component {
	constructor(props) {
		super(props);
		this.state = {
			foodoptions: [],
		};
  }
  
  componentDidMount() {
    axios.get(`${serverURL}/getallfood`)
      .then(res => {
        console.log(res.data)
        console.log(Array.from(res.data.data))
        this.setState({
          foodoptions: Array.from(res.data.data)
        });
      })
  }

	render() {
    console.log(this.state.foodoptions)

		return (
			<Container className="ViewFoodOptions">
				<ListGroup>
					{this.state.foodoptions.map(item => (
						<ListGroup.Item className="food-option">
							<div className="food-option-inner">
								<div>
									<Image rounded className="vfo-image" src={item.image} />
								</div>
								<div className="vfo-info">
									<div className="vfo-foodname">
										<p>{item.name}</p>
									</div>
									<div className="vfo-description">
										<p>{item.description}</p>
									</div>
									<div className="vfo-chefname">
										<p>{item.homecook}</p>
									</div>
								</div>
								<p className="vfo-price">${item.price}</p>
							</div>
						</ListGroup.Item>
					))}
				</ListGroup>
			</Container>
		)
	}

}
export default ViewFoodOptions