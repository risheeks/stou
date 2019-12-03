import React, { Component } from 'react';

import {Button, ListGroup, Container} from "react-bootstrap";
import axios from 'axios';
import "../../styles/Main.css";
import { serverURL } from '../../config';
import { pusher } from '../../config';
import notificationSound from '../../constants/sounds/notification.mp3';


class Requests extends Component {
  constructor(props) {
    super(props);
    this.state = {
        requests: [{cook: 'Cook1', customer: 'Customer1', itemName: 'Name1', itemDescription: 'Blah Blah Description Blah Blah', status: 'Pending'}, {cook: 'Cook2', customer: 'Customer2', itemName: 'Name2', itemDescription: 'Blah Blah Description Blah Blah', status: 'Pending'}],
        //requests: []
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
        }
    })
  }   
  
    acceptRequest = (e) => {
        //console.log(request);
        e.preventDefault();
        axios.post(`${serverURL}/changerequeststatus`, {
            data: {
                cookEmail: this.props.cookEmail,
                customerEmail: this.props.customerEmail,
                itemName: this.state.request,
                status: 1            
            }
        })
        .then(res => {
            console.log(res.data);
            let channel = pusher.subscribe(`customer-${this.props.customerEmail}`);
            channel.bind('request-accepted', function (data) {
            const audio = new Audio(notificationSound);
            audio.play();
            //openModal(ModalKey.NEW_ORDER, {...data});
            });
        })
    }

    rejectRequest = (e) => {
        //console.log(request);
        e.preventDefault();
                e.preventDefault();
        axios.post(`${serverURL}/changerequeststatus`, {
            data: {
                cookEmail: this.props.cookEmail,
                customerEmail: this.props.customerEmail,
                itemName: this.state.request,
                status: 2            
            }
        })
        .then(res => {
            console.log(res.data);
            let channel = pusher.subscribe(`customer-${this.props.customerEmail}`);
            channel.bind('request-rejected', function (data) {
            const audio = new Audio(notificationSound);
            audio.play();
            //openModal(ModalKey.NEW_ORDER, {...data});
            });
        })   
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