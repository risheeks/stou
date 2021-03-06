import React from 'react'
import { ChatManager, TokenProvider } from '@pusher/chatkit-client'
import MessageList from './MessageList'
import SendMessageForm from './SendMessageForm'
import RoomList from './RoomList'
import { tokenUrl, instanceLocator } from '../../config'
import Maximized from './Maximized'
import Minimized from './Minimized'
import { ThemeProvider, FixedWrapper, darkTheme, elegantTheme, purpleTheme, defaultTheme } from '@livechat/ui-kit'

const themes = {
    defaultTheme: {
        FixedWrapperMaximized: {
            css: {
                boxShadow: '0 0 1em rgba(0, 0, 0, 0.1)',
            },
        },
    },
    purpleTheme: {
        ...purpleTheme,
        TextComposer: {
            ...purpleTheme.TextComposer,
            css: {
                ...purpleTheme.TextComposer.css,
                marginTop: '1em',
            },
        },
        OwnMessage: {
            ...purpleTheme.OwnMessage,
            secondaryTextColor: '#fff',
        },
    },
    elegantTheme: {
        ...elegantTheme,
        Message: {
            ...darkTheme.Message,
            secondaryTextColor: '#fff',
        },
        OwnMessage: {
            ...darkTheme.OwnMessage,
            secondaryTextColor: '#fff',
        },
    },
    darkTheme: {
        ...darkTheme,
        Message: {
            ...darkTheme.Message,
            css: {
                ...darkTheme.Message.css,
                color: '#fff',
            },
        },
        OwnMessage: {
            ...darkTheme.OwnMessage,
            secondaryTextColor: '#fff',
        },
        TitleBar: {
            ...darkTheme.TitleBar,
            css: {
                ...darkTheme.TitleBar.css,
                padding: '1em',
            },
        },
    },
}

const commonThemeButton = {
    fontSize: '16px',
    padding: '1em',
    borderRadius: '.6em',
    margin: '1em',
    cursor: 'pointer',
    outline: 'none',
    border: 0,
}

const themePurpleButton = {
    ...commonThemeButton,
    background: 'linear-gradient(to right, #6D5BBA, #8D58BF)',
    color: '#fff',
}

class Chat extends React.Component {

    constructor() {
        super()
        this.state = {
            roomId: null,
            messages: {},
            joinableRooms: [],
            joinedRooms: [],
            otherAvatarURL: '',
            myAvatarURL: ''
        }
        this.sendMessage = this.sendMessage.bind(this)
        this.subscribeToRoom = this.subscribeToRoom.bind(this)
        this.getRooms = this.getRooms.bind(this)
    }

    handleThemeChange = ({ target }) => {
        console.log('target.name', target.name)
        this.setState({
            theme: target.name + 'Theme',
        })
    }

    componentDidMount() {
        const chatManager = new ChatManager({
            instanceLocator: instanceLocator,
            userId: 'admin',
            tokenProvider: new TokenProvider({
                url: tokenUrl,
            })
        })
        chatManager.connect({
            onAddedToRoom: room => {
                this.getRooms();
            },
            onRemovedFromRoom: room => {
                this.getRooms();
            }
        })
            .then(currentUser => {
                this.setState({ currentUser });
                this.getRooms();
            })
            .catch(err => console.log('error on connecting: ', err))
    }

    getRooms() {
        const rooms = this.state.currentUser.rooms;
        const messages = this.state.messages;
        if (rooms && rooms.length < 1) {
            this.setState({
                messages: {},
                roomId: '',
                joinedRooms: []
            })
            return;
        }
        for (let i = 0; i < rooms.length; i++) {
            messages[rooms[i].id] = [];
        }
        this.setState({
            messages: messages,
            roomId: rooms[0].id,
            joinedRooms: []
        },
            () => {
                this.subscribeToRoom(rooms[0].id);
                for (let i = 0; i < rooms.length; i++) {
                    this.subscribeToRoom(rooms[i].id)
                }
            }
        )
    }

    subscribeToRoom(roomId) {
        this.state.currentUser.subscribeToRoom({
            roomId: roomId,
            hooks: {
                onMessage: message => {
                    let messages = this.state.messages;
                    messages[roomId] = [...this.state.messages[roomId], message]
                    this.setState({
                        messages: messages
                    })
                }

            }
        })
            .then(room => {
                this.setState({
                    joinedRooms: [...this.state.joinedRooms, room]
                })
            })
            .catch(err => console.log('error on subscribing to room: ', err))
    }

    sendMessage(text) {
        this.state.currentUser.sendMessage({
            text,
            roomId: this.state.roomId
        })
    }

    changeRoomId = (roomId) => {
        this.setState({
            roomId: roomId,
        })
    }

    leaveRoom = () => {
        this.state.currentUser.leaveRoom({
            roomId: this.state.roomId
        })
    }

    render() {
        return (
            <ThemeProvider theme={themes['elegantTheme']}>
                <FixedWrapper.Root>
                    <FixedWrapper.Maximized style={{
                        display: 'flex',
                        flexDirection: 'row',
                        height: 'none !important',
                        width: '500px',
                        boxShadow: 'none !important'
                    }}>
                        <RoomList
                            rooms={this.state.joinedRooms}
                            changeRoomId={this.changeRoomId}
                            ownId={'admin'}
                        />
                        <Maximized
                            messages={this.state.roomId && this.state.roomId !== '' ? this.state.messages[this.state.roomId] : []}
                            sendMessage={this.sendMessage}
                            ownId={'admin'}
                            leaveRoom={this.leaveRoom}
                        />
                    </FixedWrapper.Maximized>
                    <FixedWrapper.Minimized>
                        <Minimized {...this.props} />
                    </FixedWrapper.Minimized>
                </FixedWrapper.Root>
            </ThemeProvider>
        );
    }
}

export default Chat