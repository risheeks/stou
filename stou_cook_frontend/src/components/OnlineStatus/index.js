import React, { Component } from "react";
import { Button, ToggleButton, ToggleButtonGroup, Form, FormCheck } from "react-bootstrap";
import axios from 'axios';
import { serverURL } from '../../config';
import { ROLE } from '../../constants';
import { pusher } from '../../config';
import { ModalKey } from "../../constants/ModalKeys";
import notificationSound from '../../constants/sounds/notification.mp3';
import Raven from 'raven-js';

export class OnlineStatus extends Component {
	constructor(props) {
		super(props);
		this.state = {
			onlineStatus: false
		};
	}

	componentDidMount() {
		const { openModal } = this.props;

		const data = {
			cookEmail: this.props.email,
			role: ROLE
		}
		axios.post(`${serverURL}/getstatus`, { data })
			.then(res => {
				const status = Boolean(res.data.data.status);
				if (status === true) {
					let channel = pusher.subscribe(`cook-${this.props.email}`);
					channel.bind('new-order', function (data) {
						const audio = new Audio(notificationSound);
						audio.play();
						openModal(ModalKey.NEW_ORDER, {...data});
					});
				}
				this.setState({
					onlineStatus: status
				});
			})
			.catch(err => {
				Raven.captureException("GetStatus: " + err);
			})
	}

	componentDidUpdate(prevProps) {
		if (prevProps.email !== this.props.email) {
			const { openModal } = this.props;

			const data = {
				cookEmail: this.props.email,
				role: ROLE
			}
			axios.post(`${serverURL}/getstatus`, { data })
				.then(res => {
					const status = Boolean(res.data.data.status);
					if (status === true) {
						let channel = pusher.subscribe(`cook-${this.props.email}`);
						channel.bind('new-order', function (data) {
							const audio = new Audio(notificationSound);
							audio.play();
							openModal(ModalKey.NEW_ORDER, {...data});
						});
					}
					this.setState({
						onlineStatus: status
					});
				})
				.catch(err => {
					Raven.captureException("GetStatus: " + err);
				})
		}
	}

	statusToggleHandler = (e) => {
		const currentStatus = this.state.onlineStatus;
		this.setState({
			onlineStatus: !currentStatus
		})
		this.updateStatus();
	}

	updateStatus = (e) => {
		const { openModal } = this.props;

		axios.post(`${serverURL}/setstatus`, {
			data: {
				email: this.props.email,
				status: !this.state.onlineStatus,
				role: ROLE
			}
		})
			.then(res => {
				let status = res.data.status;
				if (status === true) {
					let channel = pusher.subscribe(`cook-${this.props.email}`);
					channel.bind('new-order', function (data) {
						const audio = new Audio(notificationSound);
						audio.play();
						openModal(ModalKey.NEW_ORDER, {...data});
					});
				}
			})
			.catch(err => {
				Raven.captureException("SetStatus: " + err);
			})
	}

	render() {
		let content = <p>Offline</p>;
		if (this.state.onlineStatus) {
			content = <p>Online</p>
		}
		else {
			content = <p>Offline</p>
		}
		return (
			<div>
				<div className="checkbox-div online-status-position">
					<FormCheck custom type="switch">
						<Form.Check.Input isInvalid checked={this.state.onlineStatus} />
						<Form.Check.Label className="online-status-label" onClick={this.statusToggleHandler}>
							{content}
						</Form.Check.Label>
					</FormCheck>
				</div>
			</div>
		)
	}
}
export default OnlineStatus;