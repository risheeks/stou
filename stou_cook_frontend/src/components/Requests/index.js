import React, { Component } from 'react';

import {Button, ListGroup, Container} from "react-bootstrap";
import axios from 'axios';
import "../../styles/Main.css";
import { serverURL } from '../../config';


class Requests extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requests: [{name: 'Name1', description: 'Blah Blah Description Blah Blah', customer: 'Customer1', status: 'Pending'}, {name: 'Name2', description: 'Blah Blah', customer: 'Customer2', status: 'Pending'}],
    };
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
                <Button className="margined-buttons request-button" variant="danger">Reject</Button>    
                <Button className="margined-buttons request-button" variant="success">Accept</Button>    
               
              
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Container>
    )
  } 
  
}


export default Requests;