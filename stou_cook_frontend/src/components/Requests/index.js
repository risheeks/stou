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
        //requests: [{cook: 'Cook1', customer: 'Customer1', itemName: 'Name1', itemDescription: 'Blah Blah Description Blah Blah', status: 'Pending'}, {cook: 'Cook2', customer: 'Customer2', itemName: 'Name2', itemDescription: 'Blah Blah Description Blah Blah', status: 'Pending'}],
        requests: []
    };
  }

  componentDidMount() {
    this.getRequests();
  }

  getRequests = () => {
    //console.log("my email below on Requests")
    //console.log(this.props.email)
    //console.log(this.state.feedback)
    const { openModal} = this.props;
    console.log("cook email below from request cookside")
    console.log(this.props.email)

    axios.post(`${serverURL}/getrequest`, {
        data: {
            email: this.props.email,
            role: 1            
        }
    })
    .then(res => {
        if (res.data.data.length > 0) {
            this.setState({
                requests: Array.from(res.data.data)
            });

            //console.log(Array.from(res.data.data))
        }
        else{
            //console.log("missing")
        }
    })
  }

    acceptRequest (email, name, e) {         //console.log(request);
        e.preventDefault();
        axios.post(`${serverURL}/changerequeststatus`, {
            data: {
                cookEmail: this.props.email,
                customerEmail: email,
                itemName: name,
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

    rejectRequest (email, name, e) {
        //console.log(request);
        e.preventDefault();
        axios.post(`${serverURL}/changerequeststatus`, {
            data: {
                cookEmail: this.props.email,
                customerEmail: email,
                itemName: name,
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
                  <p>{item.itemName} for {item.customer}</p>                  
                  <p>{item.itemDescription}</p>                                  
                </div>
                

                { (item.status == 0) ? 
                    <div>
                        <Button className="margined-buttons request-button" onClick={e => this.rejectRequest(item.customerEmail, item.itemName, e)} variant="danger">Reject</Button>    
                        <Button className="margined-buttons request-button" onClick={e => this.acceptRequest(item.customerEmail, item.itemName, e)} variant="success">Accept</Button>    
                    </div> :
                    <div className="request_status">
                        <p>Request Updated</p>
                    </div>

                }
              
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Container>
    )
  } 
  
}


export default Requests;