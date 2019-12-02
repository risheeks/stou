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

const getAvatarForUser = (userId, users) => {
	const foundUser = users[userId]
	if (foundUser && foundUser.avatarUrl) {
		return foundUser.avatarUrl
	}
	return null
}

const parseUrl = (url) => url && 'https://' + url.replace(/^(http(s)?\:\/\/)/, '').replace(/^\/\//, '')

class Maximized extends React.Component {

	// const Maximized = ({
	// 	chatState,
	// 	events,
	// 	onMessageSend,
	// 	users,
	// 	ownId,
	// 	currentAgent,
	// 	minimize,
	// 	maximizeChatWidget,
	// 	sendMessage,
	// 	rateGood,
	// 	rateBad,
	//     rate,
	//     messages
	// }) => {

	constructor() {
		super()
		this.state = {
			textMessage: '',
		}
	}

	render() {
		const { messages } = this.props;
		return (
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					width: '300px',
				}}
			>
				<TitleBar
					rightIcons={[
						<IconButton key="close" onClick={this.props.minimize}>
							<CloseIcon />
						</IconButton>,
					]}
					title="Welcome to LiveChat"
				/>
				{this.props.email && (
					<AgentBar>
						<Row flexFill>
							{/* <Column>
							<Avatar imgUrl={parseUrl(this.props.email.avatarUrl)} />
						</Column> */}
							<Column flexFill>
								<Title>{this.props.name}</Title>
								<Subtitle>Support hero</Subtitle>
							</Column>
							<Column flexFit>
								{this.props.chatState === 'CHATTING' &&
									<Row>
										<IconButton onClick={this.props.rateGood}>
											<RateGoodIcon style={{
												opacity: this.props.rate === 'good' ? '1' : '0.5'
											}} />
										</IconButton>
										<IconButton onClick={this.props.rateBad}>
											<RateBadIcon style={{
												opacity: this.props.rate === 'bad' ? '1' : '0.5'
											}} />
										</IconButton>
									</Row>
								}
							</Column>
						</Row>
					</AgentBar>
				)}
				<div
					style={{
						flexGrow: 1,
						minHeight: 0,
						height: '20rem',
					}}
				>
					<MessageList active containScrollInSubtree>
						{this.props.messages.map((message, index) =>
								<Row reverse={message.senderId === this.props.ownId}>
									<Avatar imgUrl={message.sender.avatarURL} />
									<Message
										authorName={message.sender.name}
										date={(new Date(message.createdAt)).toLocaleTimeString()}
										isOwn={message.senderId === this.props.ownId}
										key={message.id}
									>
										<Bubble >
											{message.title && <MessageTitle title={message.title} />}
											{message.text && <MessageText>{message.text}</MessageText>}
											{message.imageUrl && (
												<MessageMedia>
													<img src={message.imageUrl} />
												</MessageMedia>
											)}
											{message.buttons &&
												message.buttons.length !== 0 && (
													<MessageButtons>
														{message.buttons.map((button, buttonIndex) => (
															<MessageButton
																key={buttonIndex}
																label={button.title}
																onClick={() => {
																	this.props.sendMessage(button.postback)
																}}
															/>
														))}
													</MessageButtons>
												)}
										</Bubble>
									</Message>
								</Row>
						)}
					</MessageList>
				</div>
				<TextComposer onSend={this.props.sendMessage}>
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


export default Maximized