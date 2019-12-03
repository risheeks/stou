import React, { Component } from 'react';

import {Button, ListGroup, Container} from "react-bootstrap";
import axios from 'axios';
import "../../styles/Main.css";
import { serverURL } from '../../config';


class Requests extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requests: [{cook: 'Cook1', customer: 'Customer1', itemName: 'Name1', itemDescription: 'Blah Blah Description Blah Blah', status: 'Pending'}, {cook: 'Cook2', customer: 'Customer2', itemName: 'Name2', itemDescription: 'Blah Blah Description Blah Blah', status: 'Pending'}],
    };
  }

  componentDidMount() {
    this.getRequests();
  }

  getRequests = () => {
    //console.log(this.state.feedback)
    const { openModal} = this.props;

    axios.post(`${serverURL}/getrequest`, {
        data: {
            cookEmail: this.props.cookEmail,
            role: 1            
        }
    })
    .then(res => {
        if (res.data.name.length > 0) {
            this.setState({
                requests: Array.from(res.data.data)
            });
        };
    }
  }   
  
    acceptRequest = (e) => {
        //console.log(request);
        e.preventDefault();
        
    }

    rejectRequest = (e) => {
        //console.log(request);
        e.preventDefault();
        
    }

  render() {
    return (
      <Container className="orders-container">
        <ListGroup className="orders-list">
          {this.state.requests.map(item => (
            <ListGroup.Item className="">
              
                <div className="request_texts">
                  <p>{item.name} for {item.customer}</p>                  
                  <p>{item.description}</p>                                  
                </div>
                <Button className="margined-buttons request-button" onClick={e => this.rejectRequest(e)} variant="danger">Reject</Button>    
                <Button className="margined-buttons request-button" onClick={e => this.acceptRequest(e)} variant="success">Accept</Button>    
               
              
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Container>
    )
  } 
  
}


export default Requests;