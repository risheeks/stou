import React, { Component } from "react";
import { Button, ToggleButton, ToggleButtonGroup, Form, FormCheck } from "react-bootstrap";


export class OnlineStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      onlineStatus: false
    };
  }

  statusToggleHandler =(e)=> {
  	const currentStatus=this.state.onlineStatus;
  	this.setState({
  		onlineStatus: !currentStatus
  	})
  }

  render() {
  	let content = <p>Offline</p>;
  	if(this.state.onlineStatus){
	  		content= <p>Online</p>
	  }
	  else{
	  		content= <p>Offline</p>
	  }
  	return(
	  	<div>  
	      <div className="checkbox-div online-status-position">
	      	<FormCheck custom type="switch">
          	<Form.Check.Input isInvalid checked={this.state.onlineStatus} />
            <Form.Check.Label onClick={this.statusToggleHandler}>
            	{content}
            </Form.Check.Label>
          </FormCheck>
	      </div>
	    </div>
  	)
  }	
}			
export default OnlineStatus;