import React, { Component } from 'react';
import { Accordion, Card, Button } from 'react-bootstrap';

class Feedback extends Component {
    constructor(props) {
        super(props);
        this.state = {
            feedbackList: [
                {
                    name: 'Soumil Uppal',
                    email: 'soumil.barca@gmail.com',
                    feedback: 'I think the website is too clunky and can look better.',
                    time: '06 Nov, 2016'
                },
                {
                    name: 'Soumil Uppal',
                    email: 'soumil.barca@gmail.com',
                    feedback: 'I think the website is too clunky and can look better.',
                    time: '06 Nov, 2016'
                },
                {
                    name: 'Soumil Uppal',
                    email: 'soumil.barca@gmail.com',
                    feedback: 'I think the website is too clunky and can look better.',
                    time: '06 Nov, 2016'
                },
                {
                    name: 'Soumil Uppal',
                    email: 'soumil.barca@gmail.com',
                    feedback: 'I think the website is too clunky and can look better.',
                    time: '06 Nov, 2016'
                }
            ]
        }
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
                                    <p className="feedback-card-header-text">Feedback from <b>{feedback.name} - {feedback.email}</b></p>
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
