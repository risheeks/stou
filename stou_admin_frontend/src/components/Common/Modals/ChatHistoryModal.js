import React, { Component } from "react";
import { Modal, Button, Form, Col, Row, Image } from "react-bootstrap";
import { ModalKey } from '../../../constants/ModalKeys';
import CustomRating from "../CustomRating";
import {RommList} from '../../Chat'
import axios from 'axios';
import { serverURL } from "../../../config";
import {tokenUrl, instanceLocator} from '../../../config'
import { ChatManager, TokenProvider } from '@pusher/chatkit-client'
import RoomList from "../../Chat/RoomList";

class ChatHistoryModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: this.props.currentUser,
            messages: []
        }
    }

    getRoomMessages = async roomId => {
        console.log(roomId)
        await this.state.currentUser.subscribeToRoom({
            roomId: roomId,
            hooks: {
                onMessage: message => {
                    let messages = this.state.messages;
                    messages= [...this.state.messages, message]
                    this.setState({
                        
                        messages: messages
                    })
                }

            }
        })
        .then(e => {
            const {openModal} = this.props;
            // console.log(this.state.messages);
            openModal(ModalKey.MESSAGES, { roomName: roomId, messages: this.state.messages, user: this.props.retProps.user, role: this.props.retProps.userRole, reloadAfterBan: this.props.retProps.reloadAfterBan, openModal})
        })
        .catch(err => console.log('error on subscribing to room: ', err))
        
    }

    handleBackButton = e =>{
        const {openModal} = this.props;
        openModal(ModalKey.BAN_PROFILE, { user: this.props.retProps.user, role: this.props.retProps.userRole, reloadAfterBan: this.props.retProps.reloadAfterBan, openModal})
    }

    render() {
        let { showModal, closeModal } = this.props;
        return (
            <Modal show={showModal} onHide={() => closeModal()}>
                <Modal.Header closeButton className="profile-footer-modal">
                    <Form.Label className='text-profile-modal'><h1 className='text-profile-name-modal'>User Rooms</h1></Form.Label>
                </Modal.Header>
                <Modal.Body>
                    <RoomList rooms={this.state.currentUser.rooms} getRoomMessages={this.getRoomMessages}/>
                </Modal.Body>
                <Modal.Footer className="profile-footer-modal">
                    <Button onClick={this.handleBackButton}>Back</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default ChatHistoryModal;