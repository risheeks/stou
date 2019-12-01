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

const themeDarkButton = {
    ...commonThemeButton,
    background: 'rgba(0, 0, 0, 0.8)',
    color: '#fff',  
}

const themeDefaultButton = {
    ...commonThemeButton,
    background: '#427fe1',
    color: '#fff',  
}

const themeElegantButton = {
    ...commonThemeButton,
    background: '#000',
    color: '#D9A646',  
}

class Chat extends React.Component {

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
    
    handleThemeChange = ({ target }) => {
        console.log('target.name', target.name)
        this.setState({
            theme: target.name + 'Theme'    ,
        })
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
            // console.log("props user: " + this.props.email)
            // const chatManager = new ChatManager({
            //     instanceLocator: instanceLocator,
            //     userId: this.props.email,
            //     tokenProvider: new TokenProvider({
            //         url: tokenUrl,
    
            //     })
            // })
            // console.log("before connecting")
            // chatManager.connect({
            //     onAddedToRoom: room => {
            //         console.log(`Added to room ${room.name}`)
            //         //Edit to fit UI
            //     }
            // })
            // .then(currentUser => {
            //     this.setState({currentUser})
            //     this.getRooms()
            // })
            // .catch(err => console.log('error on connecting: ', err))
            const chatManager = new ChatManager({
                instanceLocator: instanceLocator,
                userId: this.props.email,
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
            console.log("joined rooms" + this.state.joinedRooms)
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
            <ThemeProvider theme={themes[this.state.theme]}>
                <div style={{
                }}>
                    <header style={{
                        backgroundColor: '#17212D',
                        color: '#fff',
                        padding: '1em',
                    }}>
                        <div style={{
                            maxWidth: '990px',
                            margin: '0 auto',
                        }}>
                            <h1 style={{
                                fontSize: '3em',
                                lineHeight: '1em',
                                fontWeight: '600',
                            }}>
                                Chat widget
                            </h1>
                            <h2 style={{
                                color: '#f6e273',
                                fontWeight: '400',
                            }}>LiveChat React UI Kit sample</h2>
                        </div>
                    </header>
                    <div style={{
                        maxWidth: '990px',
                        margin: '3em auto',
                    }}>
                        <p>Sample chat widget built with <a href="https://docs.livechatinc.com/react-chat-ui-kit/" target="_blank">LiveChat React chat UI kit</a>. In this widget, <a href="https://www.botengine.ai/">BotEngine</a> handles the incoming chats. When the bot returns `LiveChat.transfer` action, the chat is transferred to a human agent together with the transcript of the initial conversation with the bot.</p>
                        <p>The sample app uses <a href="https://docs.livechatinc.com/visitor-sdk/" target="_blank">Visitor SDK</a> to communicate with LiveChat and <a href="https://docs.botengine.ai/api/introduction">the API</a> to connect with BotEngine.</p>
                        <p>Source code is avaible at <a href="https://github.com/livechat/chat-widget-sample" target="_blank">Github</a>.</p>
                        <h3>Change components theme:</h3>
                        <button id="theme-default" name="default" style={themeDefaultButton} onClick={this.handleThemeChange.bind(this)}>
                            default
                        </button>
                        <button id="theme-purple" name="purple" style={themePurpleButton} onClick={this.handleThemeChange.bind(this)}>
                            purple
                        </button>
                        <button id="theme-dark" name="dark" style={themeDarkButton} onClick={this.handleThemeChange.bind(this)}>
                            dark
                        </button>
                        <button id="theme-elegant" name="elegant" style={themeElegantButton} onClick={this.handleThemeChange.bind(this)}>
                            elegant
                        </button>
                    </div>
                    <FixedWrapper.Root maximizedOnInit>
                        <FixedWrapper.Maximized>
                            <RoomList rooms={this.state.joinedRooms} subscribeToRoom={this.subscribeToRoom} roomId={this.state.roomId} />
                            <Maximized 
                                messages={this.state.messages} 
                                sendMessage={this.sendMessage}
                                ownId={this.props.email}
                            />
                        </FixedWrapper.Maximized>
                        <FixedWrapper.Minimized>
                            <Minimized {...this.props} />
                        </FixedWrapper.Minimized>
                    </FixedWrapper.Root>
                </div>
			</ThemeProvider>
        );
    }
}

export default Chat