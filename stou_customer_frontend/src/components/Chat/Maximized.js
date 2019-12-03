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
		console.log(this.props.messages)
		return (
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					height: '100%',
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
						height: '100%',
					}}
				>
					<MessageList active containScrollInSubtree>
						{this.props.messages.map((message, index) => (
							<Message
								// avatarUrl={parseUrl(getAvatarForUser(message.authorId, users))}
								date={message.parsedDate}
								isOwn={message.userId === this.props.email}
								key={message.id}
							>
								<Bubble isOwn={message.authorId === this.props.email}>
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
						))}
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
				<div
					style={{
						textAlign: 'center',
						fontSize: '.6em',
						padding: '.4em',
						background: '#fff',
						color: '#888',
					}}
				>
					{'Powered by LiveChat'}
				</div>
			</div>
		)
	}
}


export default Maximized