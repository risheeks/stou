import React, { Component } from "react";
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { serverURL } from '../../config';
import { withRouter } from 'react-router-dom';
import ResetPassword from '../ResetPassword';

export class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: ""
    };
  }

  componentDidMount() { 
    if(this.props.auth_token && this.props.auth_token.length > 0) {
      this.props.history.push('/');
    }
  }

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = event => {
    const { email, password } = this.state;
    let SHA256 = require("crypto-js/sha256");
    let encryptedPassword = SHA256(password);
    axios.post(`${serverURL}/login`, {
      data: {
        role: "Homecook",
        email: email,
        password: encryptedPassword.toString()
      }
    })
      .then(res => {
        console.log(res);
        this.props.getToken(res.data['token'], email);
      })
      .catch(err => {
        console.log(err);
      })
  }

  handleReset = e => {
    e.preventDefault();
    this.props.openModal();
  }

  render() {
    return (
      <div className="Login container">
        { this.props.auth_token ? this.props.history.push('/') : null}
        <ResetPassword show={this.props.showModal} closeModal={this.props.closeModal} />
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="email">
            <FormLabel>Email</FormLabel>
            <FormControl className="email"
              autoFocus
              type="email"
              value={this.state.email}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="password">
            <FormLabel>Password</FormLabel>
            <FormControl
              value={this.state.password}
              onChange={this.handleChange}
              type="password"
            />
          </FormGroup>
          <div>
            <Button
              block
              className="submit-button"
              disabled={!this.validateForm()}
              onClick={this.handleSubmit}
            >
              Login
            </Button>
            <Link to="/register" className="btn btn-link">Register</Link>
            <Link to="/reset" className="btn btn-link" onClick={this.handleReset}>Reset Password</Link>
          </div>
        </form>
      </div>
    );
  }
}

export default withRouter(Login);