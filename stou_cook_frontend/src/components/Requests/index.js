import React, { Component } from 'react';

import { Button, ListGroup, Container } from "react-bootstrap";
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
      requests: [],

    };
  }

  componentDidMount() {
    this.getRequests();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.email !== this.props.email) {
      this.getRequests();
    }
  }

  getRequests = () => {
    const { openModal } = this.props;

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
          //console.log(this.state.requests)
        }
        else {
          this.setState({
            requests: []
          });
        }
      })
  }

  acceptRequest(email, name, requestId, e) {
    e.preventDefault();
    axios.post(`${serverURL}/changerequeststatus`, {
      data: {
        requestId: requestId,
        cookEmail: this.props.email,
        customerEmail: email,
        itemName: name,
        status: 1
      }
    })
      .then(res => {
        this.getRequests();
      })
  }

  rejectRequest(email, name, requestId, e) {
    //console.log(request);
    e.preventDefault();
    axios.post(`${serverURL}/changerequeststatus`, {
      data: {
        requestId: requestId,
        cookEmail: this.props.email,
        customerEmail: email,
        itemName: name,
        status: 2
      }
    })
      .then(res => {
        this.getRequests();
      })
  }

  renderSwitch(status) {
    //console.log("status below")
    //console.log(status)
    switch (status) {
      case 0:
        return 'Pending';
      case 1:
        return 'Accepted';
      case 2:
        return 'Declined';
      default:
        return 'Pending';
    }
  }

  render() {
    return (
      <Container className="orders-container">
        <ListGroup className="orders-list">
          {this.state.requests.map(item => (
            <ListGroup.Item className="">

              <div className="request_texts">
                <p>{item.itemName} for <b>{item.customerEmail}</b></p>
                <p className="vfo-description">{item.itemDescription}</p>
              </div>

              {(item.status == 0) ?
                <div>
                  <Button className="margined-buttons request-button" onClick={e => this.rejectRequest(item.customerEmail, item.itemName, item.requestId, e)} variant="danger">Reject</Button>
                  <Button className="margined-buttons request-button" onClick={e => this.acceptRequest(item.customerEmail, item.itemName, item.requestId, e)} variant="success">Accept</Button>
                </div> :
                <div className="request_status">
                  <Button className="margined-buttons request-button" variant="info" disabled>{this.renderSwitch(item.status)}</Button>
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