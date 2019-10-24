import React, { Component } from "react";
import { Button, ToggleButton, ToggleButtonGroup } from "react-bootstrap";


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
	      <div className="checkbox-div">
	      	<ToggleButtonGroup className="single-checkbox-div" type="checkbox">
	        	<ToggleButton className="single-checkbox" onChange={this.statusToggleHandler}>{content}</ToggleButton>
	        </ToggleButtonGroup>
	      </div>
	    </div>
  	)
  }	
}			
export default OnlineStatus;