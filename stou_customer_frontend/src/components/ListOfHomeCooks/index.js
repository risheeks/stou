import React, { Component } from 'react';
import ImageOfCook from '../../constants/images/full_white_logo.png';
import './index.css';
import { Row, Col, Container, Button, ListGroup, FormControl, FormLabel, Image } from "react-bootstrap";
import HomeCook from './HomeCook';
import axios from 'axios';
import { serverURL } from '../../config';

class ListOfHomeCooks extends Component {
	constructor(props) {
		super(props);
		this.state = {
			homecooks: []
		};
	}

	componentDidMount() {
		this.getHomecooks();
		return;
	}

	getHomecooks = () => {
        axios.get(`${serverURL}/gethomecooks?location=47906`)
            .then(res => {
                console.log(res.data)
                console.log(Array.from(res.data.data))
                this.setState({
                    homecooks: Array.from(res.data.data)
                });
            });
    }

	render() {
		return (
			<Container className="homecook-container">
					{this.state.homecooks.map(item => (
						<HomeCook
							name={item.name}
							picture={item.profilePicture}
							description={item.aboutMe}
							rating={item.rating}
						/>
					))}
			</Container>
		)
	}

}
export default ListOfHomeCooks;