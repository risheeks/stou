import React, { Component } from 'react';
import { Form, Button, TextField, Modal, DialogActions, DialogContent, DialogContentText, DialogTitle } from "react-bootstrap";
import axios from 'axios';
import { serverURL } from '../../config';


class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
    }
  }

  handleChange = e => {
    this.setState({
      [e.target.id]: e.target.value,
    });
  }

  onConfirm = e => {
    const { email } = this.state;
    let SHA256 = require("crypto-js/sha256");
    let encEmail = email
    let password = Math.random().toString(36).substring(7) + Math.random().toString(36).substring(7);
    let encPassword = SHA256(password).toString();
    axios.post(`${serverURL}/forgotpassword`, {data: {
      encEmail: encEmail,
      email:email,
      password: password,
      encPassword: encPassword
    }})
      .then(res => {
        console.log(res.data);
        this.props.closeModal();
      })
      .catch(err => {
        console.log(err);
      })
  }

  render() {
    return (
      <Modal show={this.props.show}>
        <Modal.Header id="form-dialog-title">
          <Modal.Title>Forgot Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" placeholder="Type your email" onChange={this.handleChange} value={this.state.email}/>
          </Form.Group>

        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.closeModal} color="primary">
            Cancel
          </Button>
          <Button onClick={this.onConfirm} color="primary">
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default ResetPassword;