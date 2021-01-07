import * as React from 'react'
import {
    Avatar,
    TitleBar,
    TextInput,
    MessageList,
    Message,
    MessageText,
    AgentBar,
    Title,
    Subtitle,
    MessageGroup,
    MessageButtons,
    MessageButton,
    MessageTitle,
    MessageMedia,
    TextComposer,
    Row,
    Fill,
    Fit,
    IconButton,
    SendButton,
    EmojiIcon,
    CloseIcon,
    Column,
    RateGoodIcon,
    RateBadIcon,
    Bubble,
    ChatList,
    ChatListItem
} from '@livechat/ui-kit'

import { Button } from "react-bootstrap";
import { tokenUrl, instanceLocator } from '../../config'
import { ChatManager, TokenProvider } from '@pusher/chatkit-client'

const parseUrl = (url) => url && 'https://' + url.replace(/^(http(s)?\:\/\/)/, '').replace(/^\/\//, '')

class RoomList extends React.Component {

    constructor() {
        super()
        this.state = {
            textMessage: '',
        }
    }

    // componentDidMount() {
    //     console.log(this.props.email)
    //         const chatManager = new ChatManager({
    //             instanceLocator: instanceLocator,
    //             userId: this.props.email,
    //             tokenProvider: new TokenProvider({
    //                 url: tokenUrl,

    //             })
    //         })
    //         chatManager.connect({
    //             onAddedToRoom: room => {
    //                 this.getRooms()
    //             },
    //             onRemovedFromRoom: room => {
    //                 this.getRooms()
    //             }
    //         })
    //             .then(currentUser => {
    //                 this.setState({ currentUser })
    //                 this.getRooms()
    //             })
    //             .catch(err => console.log('error on connecting: ', err))
    // }

    // componentDidUpdate(prevProps) {
    //     if (this.props.email !== prevProps.email && this.props.email !== null) {
    //         console.log(this.props.email)
    //         const chatManager = new ChatManager({
    //             instanceLocator: instanceLocator,
    //             userId: this.props.email,
    //             tokenProvider: new TokenProvider({
    //                 url: tokenUrl,

    //             })
    //         })
    //         chatManager.connect({
    //             onAddedToRoom: room => {
    //                 this.getRooms()
    //             },
    //             onRemovedFromRoom: room => {
    //                 this.getRooms()
    //             }
    //         })
    //             .then(currentUser => {
    //                 this.setState({ currentUser })
    //                 // this.getRooms()
    //             })
    //             .catch(err => console.log('error on connecting: ', err))
    //     }
    // }

    changeRoomId = (id) => {
        this.props.changeRoomId(id);
    }


    cSChat = e => {
        this.props.cSChat();
    }

    renderRooms() {
        const { rooms } = this.props;
        let checkRooms = true;
        if (checkRooms) {
            return (
                <ChatList style={{ width: 200 }}>
                    <ChatListItem>
                        <Button
                            style={{ width: 162 }}

                            onClick={this.cSChat}>
                            Chat with Us
                    </Button>
                    </ChatListItem>
                    {(rooms[0] && rooms.length > 0 && rooms[0].users && rooms[0].users.length > 0) ? rooms.map((room) =>
                        <ChatListItem onClick={e => this.changeRoomId(room.id)} >
                            {console.log(room.users)}
                            <Avatar imgUrl={this.props.ownId !== room.users[0].id ? room.users[0].avatarURL : room.users[0].avatarURL} style={{ height: '40px', width: '40px' }} />
                            <Column fill>
                                <Row justify>
                                    <Title ellipsis>{this.props.ownId === room.users[0].id ? room.users[1].name : room.users[0].name}</Title>
                                </Row>
                            </Column>
                        </ChatListItem>
                    ) : null}

                </ChatList>
            );
        }
        return (
            <ChatList style={{ width: 200 }}>
                <ChatListItem>
                    <Button
                        style={{ width: 162 }}
                        onClick={this.cSChat}>
                        Chat with Us
                </Button>
                </ChatListItem>
            </ChatList>);
    }

    render() {
        return (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: 'none !important',
                }}
            >
                <TitleBar
                    rightIcons={[
                        <IconButton key="close" onClick={this.props.minimize}>
                            <CloseIcon />
                        </IconButton>,
                    ]}
                    title="Welcome to LiveChat"
                    style={{ visibility: "hidden" }}
                />
                <div
                    style={{
                        flexGrow: 1,
                        minHeight: 0,
                        height: '20rem',
                        width: '200px'
                    }}
                >
                    <MessageList active containScrollInSubtree style={{
                        background: 'white',
                        height: '75%'
                    }}>
                        <Message>
                            {this.renderRooms()}
                        </Message>
                    </MessageList>
                </div>
                <TextComposer onSend={this.props.sendMessage} style={{ visibility: 'hidden' }}>
                    <Row align="center">
                        <Fill>
                            <TextInput />
                        </Fill>
                        <Fit>
                            <SendButton />
                        </Fit>
                    </Row>
                </TextComposer>
            </div>
        )
    }
}


export default RoomList;