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
    axios.post(`${serverURL}/login`, {
      data: {
        role: "Customer",
        email,
        password
      }
    })
      .then(res => {
        this.props.getToken(res.data['token'], email);
        this.props.history.push('/');
      })
  }

  render() {
    return (
      <div className="Login container">
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