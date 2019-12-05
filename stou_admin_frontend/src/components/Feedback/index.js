import React, { Component } from 'react';
import { Accordion, Card, Button } from 'react-bootstrap';
import axios from 'axios';
import { serverURL } from '../../config';

class Feedback extends Component {
    constructor(props) {
        super(props);
        this.state = {
            feedbackList: []
        }
    }

    componentDidMount() {
        axios.get(`${serverURL}/getfeedback`)
            .then(res => {
                this.setState({
                    feedbackList: Array.from(res.data.data)
                });
            })
    }

    render() {
        const { auth_token, email, openModal } = this.props;
        const { feedbackList } = this.state;
        return (
            <div className="feedback-page">
                <Accordion>
                    {feedbackList.map((feedback, index) =>
                        <Card className="feedback-card">
                            <Card.Header className="feedback-card-header">
                                <Accordion.Toggle as={Button} variant="link" eventKey={index.toString()}>
                                    <p className="feedback-card-header-text">Feedback from <b>{feedback.email}</b></p>
                                </Accordion.Toggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey={index.toString()}>
                                <Card.Body className="feedback-card-body">{feedback.feedback}</Card.Body>
                            </Accordion.Collapse>
                        </Card>
                    )}
                </Accordion>
            </div>
        );
    }
}

export default Feedback;
