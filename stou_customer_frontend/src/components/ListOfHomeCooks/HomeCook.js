import React, { Component } from 'react';
import { Card, Button } from 'react-bootstrap';

class HomeCook extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { name, description, picture } = this.props;

        return (
            <Card className="homecook-card" style={{ width: '18rem' }}>
                <Card.Img variant="top" src={picture} style={{maxHeight: '200px'}} />
                <Card.Body>
                    <Card.Title>{name}</Card.Title>
                    <Card.Text>
                        {description}
                    </Card.Text>
                    <Button variant="primary">View Menu</Button>
                </Card.Body>
            </Card>
        );
    }
}

export default HomeCook;