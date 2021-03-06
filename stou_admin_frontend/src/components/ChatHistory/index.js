import React from 'react'
import Chatkit from '@pusher/chatkit'
import { ChatManager, TokenProvider } from '@pusher/chatkit-client'
import MessageList from './MessageList'
import SendMessageForm from './SendMessageForm'
import RoomList from './RoomList'
import { tokenUrl, instanceLocator } from '../../config'

class ChatHistory extends React.Component {

    constructor() {
        super()
        this.state = {
            roomId: null,
            messages: [],
            joinableRooms: [],
            joinedRooms: []
        }
        this.sendMessage = this.sendMessage.bind(this)
        this.subscribeToRoom = this.subscribeToRoom.bind(this)
        this.getRooms = this.getRooms.bind(this)
    } 
    
    componentDidMount() {
        // console.log("props user: " + this.props.email)
        // const chatManager = new ChatManager({
        //     instanceLocator: instanceLocator,
        //     userId: "nr"/*this.props.user*/,
        //     tokenProvider: new TokenProvider({
        //         url: tokenUrl,

        //     })
        // })
        // chatManager.connect()
        // .then(currentUser => {
        //     this.setState({currentUser})
        //     this.getRooms()
        // })
        // .catch(err => console.log('error on connecting: ', err))
    }

    componentDidUpdate(prevProps) {
        if (this.props.email !== prevProps.email && this.props.email !== null) {
            console.log("props user: " + this.props.email)
            const chatManager = new ChatManager({
                instanceLocator: instanceLocator,
                userId: 'admin',
                tokenProvider: new TokenProvider({
                    url: tokenUrl,

                })
            })
            chatManager.connect({
                onAddedToRoom: room => {
                    console.log(`Added to room ${room.name}`)
                    //Edit to fit UI
                }
            })
            .then(currentUser => {
                this.setState({currentUser})
                this.getRooms()
            })
            .catch(err => console.log('error on connecting: ', err))
        }
    }
    
    getRooms() {
        this.state.currentUser.getJoinableRooms()
        .then(joinableRooms => {
            this.setState({
                joinableRooms,
                joinedRooms: this.state.currentUser.rooms
            })
        })
        .catch(err => console.log('error on joinableRooms: ', err))
    }
    
    subscribeToRoom(roomId) {
        this.setState({ messages: [] })
        this.state.currentUser.subscribeToRoom({
            roomId: roomId,
            hooks: {
                onMessage: message => {
                    this.setState({
                        messages: [...this.state.messages, message]
                    })
                }
                
            }
        })
        .then(room => {
            this.setState({
                roomId: room.id
            })
            this.getRooms()
        })
        .catch(err => console.log('error on subscribing to room: ', err))
    }
    
    sendMessage(text) {
        this.state.currentUser.sendMessage({
            text,
            roomId: this.state.roomId
        })
    }
    
    render() {
        return (
            <div className="chat">
                <RoomList
                    subscribeToRoom={this.subscribeToRoom}
                    rooms={[...this.state.joinableRooms, ...this.state.joinedRooms]}
                    roomId={this.state.roomId} />
                <MessageList 
                    roomId={this.state.roomId}
                    messages={this.state.messages} />
                <SendMessageForm
                    disabled={!this.state.roomId}
                    sendMessage={this.sendMessage} />
            </div>
        );
    }
}

export default ChatHistory