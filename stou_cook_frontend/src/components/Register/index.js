import React, { Component } from 'react';
import { Button, FormGroup, FormControl, FormLabel, Alert } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css';
import sha256 from 'crypto-js/sha256';

class Register extends Component {
  constructor(props){
    super(props); 
   this.state = {
      firstName: '',
      lastName: '',
      password: '',
      confirmpassword: '',
      email: '',
      registerCheck:true,
      registerErrorMessage: '',
      valid: {
        firstName: true,
        lastName: true,
        password: true,
        confirmpassword: true,
        email: true,
      },
      touched: {
        firstName: false,
        lastName: false,
        password: false,
        confirmpassword: false,
        email: false
      },
      modalisOpen: false
    };

    this.rexExpMap = {
      firstName: /^[a-zA-Z\u00c4\u00e4\u00d6\u00f6\u00dc\u00fc\u00df]+$/,
      lastName: /^[a-zA-Z\u00c4\u00e4\u00d6\u00f6\u00dc\u00fc\u00df]+$/,
      password: /^.{8,}$/,
      confirmpassword: /^.{8,}$/,
      email: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    }
  
    this.handleChange = this.handleChange.bind(this);
    this.checkData = this.checkData.bind(this);
    //this.toggleModal = this.toggleModal.bind(this);
    this.checkOnSubmit = this.checkOnSubmit.bind(this);
  }

  handleChange = (e, name) => {
    this.state.registerCheck = true;
    this.setState({[e.target.name]: e.target.value}, () => {
      this.checkData(this.rexExpMap[name], this.state[name], this.state.valid[name], name)
    });
  }
  checkData(regExp, stateName, stateValid, name){
    this.setState({
      touched: { ...this.state.touched, [name]: true }
    });
   if(regExp.test(stateName)) {
      this.setState({
        valid: { ...this.state.valid, [name]: true }
      });
    } else {
      this.setState({
        valid: { ...this.state.valid, [name]: false }
      });
    }
  }
  validate(firstName, lastName, password, confirmpassword, email) {  
    return {
      firstName: firstName.length === 0,
      lastName: lastName.length === 0,
      password: password.length === 0,
      confirmpassword: confirmpassword.length === 0,
      email: email.length === 0
    };
  }
  requiredStyle(name) {
    const show = (this.state[name] === "" || !this.state.valid[name]) && this.state.touched[name];
    return {display: show ? 'block' : 'none'}
  }
  errorMessages(name) {
  
    if(name === "confirmpassword") {
      if(name != this.state.password) {
        return "Passwords does not match"
      }
    }
    const requiredStr = 'This field is required.';
    const invalidStr = 'Enter valid '+ name +'.';
    return !this.state.valid[name] && this.state[name] !== "" ? invalidStr : requiredStr
  }
  checkOnSubmit() {
    const {firstName, lastName, password, confirmpassword, email } = this.state;    
    const formFilled = !(firstName === '' || lastName === '' ||password === '' || confirmpassword === '' || email === '');
    const formInvalid = Object.keys(this.state.valid).some(x => !this.state.valid[x]);
    const formHasErrors = !formFilled || formInvalid;

    if (formHasErrors) {
      this.state.registerErrorMessage = "Registration failed"
      this.state.registerCheck = false;
    }else if(password != confirmpassword) {
      this.state.registerErrorMessage = "Passwords do not match"
      this.state.registerCheck = false;
    }
    else {
      this.state.registerCheck = true;
    }
    //AES ENCRYPTION
    var CryptoJS = require("crypto-js");
    // Encrypt
    var encryptedFirstName = CryptoJS.AES.encrypt(firstName, 'weab66c4xyz09AZMLo').toString();
    var encryptedLastName = CryptoJS.AES.encrypt(lastName, 'weab66c4xyz09AZMLo').toString();
    var encryptedEmail = CryptoJS.AES.encrypt(email, 'weab66c4xyz09AZMLo').toString();    // Decrypt
    var bytesFirstName  = CryptoJS.AES.decrypt(encryptedFirstName, 'weab66c4xyz09AZMLo');
    var originalText = bytesFirstName.toString(CryptoJS.enc.Utf8);
    console.log(originalText);
    //SHA256
    var SHA256 = require("crypto-js/sha256");
    var encryptedPassword = SHA256(password)
    console.log(encryptedPassword);
    
    if (!formHasErrors) {
        //this.toggleModal();
        console.log(firstName + " " + lastName + " " + password + " " + confirmpassword + " " + email)
    }
    this.setState({
      touched: {
        firstName: true,
        lastName: true,
        password: true,
        confirmpassword: true,
        email: true,
      },
    });
    /* Form gave an error */

  }
  
  render() {
    const errors = this.validate(this.state.firstName, this.state.lastName, this.state.password, this.state.confirmpassword, this.state.email);
    const shouldMarkError = (field) => {
      const hasError = errors[field];
      const shouldShow = this.state.touched[field];
      return hasError ? shouldShow : false;
    }
    const helpMessage = (name) =>{
      return {display: shouldMarkError(name) ? 'none' : 'block'}
    }
    
    return (
    <div className="Register container">
      <Alert hidden={this.state.registerCheck} variant="danger">{this.state.registerErrorMessage}</Alert>
        {/* <div className="title">Create Your Stou Account</div> */}
        <div className="form">
        <FormGroup controlId="firstname" bsSize="large">
            <FormLabel>
            First Name
            <FormControl
                type="text"
                value={this.state.firstName}
                name="firstName" id="firstName"
                className={shouldMarkError("firstName") ? "error" : ""}
                onChange={(e) => this.handleChange(e, "firstName")} />
            </FormLabel>
            <span className="required-field" style={this.requiredStyle('firstName')}>{this.errorMessages('firstName')}</span>
        </FormGroup>

        <FormGroup controlId="lastname" bsSize="large">
            <FormLabel>
            Last Name
            <FormControl
                type="text" 
                value={this.state.lastName} 
                name="lastName" id="lastName"
                className={shouldMarkError("lastName") ? "error" : ""}
                onChange={(e) => this.handleChange(e, "lastName")} />
            </FormLabel>
            <span className="required-field" style={this.requiredStyle('lastName')}>{this.errorMessages('lastName')}</span>
        </FormGroup>

        <FormGroup controlId="password" bsSize="large">
            <FormLabel>
            Password
            <FormControl
                type="password"
                value={this.state.password}
                name="password"
                className={shouldMarkError("password") ? "error" : ""}
                onChange={(e) => this.handleChange(e, "password")} />
            </FormLabel>
            <span className="note" style={helpMessage('password')}>At least 8 characters</span>
            <span className="required-field" style={this.requiredStyle('password')}>{this.errorMessages('password')}</span>
        </FormGroup>

        <FormGroup controlId="confirmpassword" bsSize="large">
            <FormLabel>
            Confirm Password
            <FormControl
                type="password"
                value={this.state.confirmpassword}
                name="confirmpassword"
                className={shouldMarkError("confirmpassword") ? "error" : ""}
                onChange={(e) => this.handleChange(e, "confirmpassword")} />
            </FormLabel>
            {/* <span className="note" style={helpMessage('confirmpassword')}>At least 8 characters</span> */}
            {/* <span className="required-field" style={this.requiredStyle('confirmpassword')}>{this.errorMessages('confirmpassword')}</span> */}
        </FormGroup>
        <FormGroup controlId="email" bsSize="large">
            <FormLabel>
            Email
            <FormControl
                type="text"
                name="email"
                value={this.state.email}
                className={shouldMarkError("email") ? "error" : ""}
                onChange={(e) => this.handleChange(e, "email")} />
            </FormLabel>
            <span className="required-field" style={this.requiredStyle('email')}>{this.errorMessages('email')}</span>
        </FormGroup>
        <Button
        block
        bsSize="large"
        className="submit-button"
        onClick={this.checkOnSubmit}
        type="submit"
        >
        Submit
        </Button>    
        </div>
    </div>
    );
  } 
  
}


export default Register;