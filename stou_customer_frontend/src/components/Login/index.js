import React, { Component } from "react";
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { serverURL } from '../../config';
import { withRouter } from 'react-router-dom';
import { ModalKey } from '../../constants/ModalKeys';
import Raven from 'raven-js';

export class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      error: null
    };
  }

  componentDidMount() {
    
    
    // console.log(this.props.auth_token);
    if (this.props.auth_token && this.props.auth_token.length > 0) {
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
        email: email,
        password: encryptedPassword.toString()
      }
    })
      .then(res => {
        // axios.post(`${serverURL}/logtofile`, {
        //   data: {
        //     data: 'First message',
        //     role: "Customer"
        //   }
        // })
        // .then(res => {
        //   console.log(res);
        // })
        // console.log(res);
        this.props.getToken(res.data['token'], email);
        this.props.history.push('/');
      })
      .catch(err => {
          
        Raven.captureException("Login: " + err);
        this.props.openModal(ModalKey.ERROR_MODAL, {...err.response.data})
       
      })
  }

  render() {
    return (
      
      <div className="master-container">
        <script src="https://cdn.ravenjs.com/3.26.4/raven.min.js"
    crossOrigin="anonymous"></script>
        <div className="Login container">
          {this.props.auth_token ? this.props.history.push('/') : null}
          <form onSubmit={this.handleSubmit}>
            <FormGroup controlId="email" bsSize="large">
              <FormLabel>Email</FormLabel>
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
                variant="danger"
                disabled={!this.validateForm()}
                onClick={this.handleSubmit}
              >
                Login
            </Button>
              <Link to="/register" className="btn btn-link">Register</Link>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(Login);