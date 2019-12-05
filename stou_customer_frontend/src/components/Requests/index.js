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

  componentDidUpdate(prevProps) {
    if(prevProps.email !== this.props.email) {
      this.getRequests();
    }
  }

  getRequests = () => {
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
          this.setState({
            requests: []
        });
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

  
  render() {
    //console.log("status below")
    //console.log(this.state.requests.status[0])
    return (
      <Container className="master-container">
        <Container className="orders-container">
        <p className="page-title"><b>Requests</b></p>
          <ListGroup className="orders-list">
            {this.state.requests.map(item => (
              <ListGroup.Item className="">

                <div className="request_texts">
                  <p>{item.itemName} from <b>{item.cookEmail}</b> </p>                  
                  <p className="vfo-description">{item.itemDescription}</p>                                  
                </div>
                <Button variant="danger" className="request-button">{this.renderSwitch(item.status)}</Button>                 
            </ListGroup.Item>
          ))}
        </ListGroup>
        </Container>
      </Container>
    )
  }

}


export default Requests;