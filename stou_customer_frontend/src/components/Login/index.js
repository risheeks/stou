import React, { Component } from "react";
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { serverURL } from '../../config';
import { withRouter } from 'react-router-dom';

export class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: ""
    };
  }

  componentDidMount() {
    console.log(this.props.auth_token);
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
        role: "Customer",
        email: btoa(email),
        password: encryptedPassword.toString()
      }
    })
      .then(res => {
        console.log(res);
        this.props.getToken(res.data['token'], email);
        this.props.history.push('/');
      })
      .catch(err => {
        console.log(err);
      })
  }

  render() {
    return (
      <div className="Login container">
        { this.props.auth_token ? this.props.history.push('/') : null}
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="email" bsSize="large">
            <FormLabel>Email/Username</FormLabel>
            <FormControl className="email"
              autoFocus
              type="email"
              value={this.state.email}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="password" bsSize="large">
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
              bsSize="large"
              className="submit-button"
              disabled={!this.validateForm()}
              onClick={this.handleSubmit}
            >
              Login
            </Button>
            <Link to="/register" className="btn btn-link">Register</Link>
          </div>
        </form>
      </div>
    );
  }
}

export default withRouter(Login);