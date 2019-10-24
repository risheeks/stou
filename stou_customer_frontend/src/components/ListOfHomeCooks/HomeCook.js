import React, { Component } from 'react';
import { Card, Button, Image } from 'react-bootstrap';
import CustomRating from '../Common/CustomRating';

class HomeCook extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { name, description, picture, rating } = this.props;

        return (
            <Card className="homecook-card" style={{ width: '18rem' }}>
                <Card.Img variant="top" src={picture} style={{maxHeight: '200px'}} />
                <Card.Body>
                    <Card.Title>{name}</Card.Title>
                    <Card.Text>
                        {description}
                    </Card.Text>
                    <CustomRating rating={rating} readonly={true} />
                    <Button variant="primary">View Menu</Button>
                </Card.Body>
            </Card>
        );
    }
}

export default HomeCook;