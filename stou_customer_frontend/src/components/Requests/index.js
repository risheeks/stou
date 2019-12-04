import React, { Component } from 'react';

import { Button, ListGroup, Container } from "react-bootstrap";
import axios from 'axios';
import "../../styles/Main.css";
import { serverURL } from '../../config';


class Requests extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //requests: [{cook: 'Cook1', customer: 'Customer1', itemName: 'Name1', itemDescription: 'Blah Blah Description Blah Blah', status: 'Pending'}, {cook: 'Cook2', customer: 'Customer2', itemName: 'Name2', itemDescription: 'Blah Blah Description Blah Blah', status: 'Pending'}]
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

    axios.post(`${serverURL}/getrequest`, {
        data: {
            email: this.props.email,
            role: 2            
        }
    })
    .then(res => {
        if (res.data.data.length > 0) {
            this.setState({
                requests: Array.from(res.data.data)
            });
            //console.log(this.state.requests)
        }
        else{
            //console.log("missing")
        }
    })
  }

    renderSwitch (status) {
        //console.log("status below")
        //console.log(status)
        switch(status) {
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

    //SELECT COOK_EMAIL, CUSTOMER_EMAIL, ITEM_NAME, ITEM_DESCRIPTION, STATUS, FIRST_NAME FROM REQUESTS, USER WHERE REQUESTS.COOK_EMAIL = USER.EMAIL;
    //SELECT COOK_EMAIL, CUSTOMER_EMAIL, ITEM_NAME, ITEM_DESCRIPTION, STATUS, FIRST_NAME FROM REQUESTS, USER WHERE REQUESTS.CUSTOMER_EMAIL = USER.EMAIL;

  
  render() {
    //console.log("status below")
    //console.log(this.state.requests.status[0])
    return (
      <Container className="master-container">
        <Container className="orders-container">
          <ListGroup className="orders-list">
            {this.state.requests.map(item => (
              <ListGroup.Item className="">

                <div className="request_texts">
                  <p>{item.itemName} from {item.cook} </p>                  
                  <p>{item.itemDescription}</p>                                  
                </div>
                <Button className="submit-button request-button">{this.renderSwitch(item.status)}</Button>                 
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Container>
    )
  }

}


export default Requests;