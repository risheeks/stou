import React, { Component } from 'react';

import {Button, ListGroup, Container} from "react-bootstrap";
import axios from 'axios';
import "../../styles/Main.css";
import { serverURL } from '../../config';


class Requests extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requests: [{cook: 'Cook1', customer: 'Customer1', itemName: 'Name1', itemDescription: 'Blah Blah Description Blah Blah', status: 'Pending'}, {cook: 'Cook2', customer: 'Customer2', itemName: 'Name2', itemDescription: 'Blah Blah Description Blah Blah', status: 'Pending'}]
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
            customerEmail: this.props.customerEmail,
            role: 2            
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




   
  
  render() {
    return (
      <Container className="orders-container master_container">
        <ListGroup className="orders-list">
          {this.state.requests.map(item => (
            <ListGroup.Item className="">
              
                <div className="request_texts">
                  <p>{item.itemName} from {item.cook} </p>                  
                  <p>{item.itemDescription}</p>                                  
                </div>
                <Button className="submit-button request-button">{item.status}</Button>                 
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Container>
    )
  } 
  
}


export default Requests;