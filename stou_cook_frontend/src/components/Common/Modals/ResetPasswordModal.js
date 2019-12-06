import React, { Component } from 'react';
import { Form, Button, TextField, Modal, DialogActions, DialogContent, DialogContentText, DialogTitle } from "react-bootstrap";
import axios from 'axios';
import { serverURL } from '../../../config';
import Raven from 'raven-js';


class ResetPasswordModal extends Component {
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
        this.props.closeModal();
      })
      .catch(err => {
        Raven.captureException("ForgotPassword: " + err);
        console.log(err);
      })
  }

  render() {
    let { showModal, closeModal} = this.props;

    return (
        <Modal show={showModal} onHide={() => closeModal()}>
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
          <Button onClick={closeModal} color="primary">
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

export default ResetPasswordModal;