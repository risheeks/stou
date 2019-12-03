import React, { Component } from 'react';
import { ModalKey } from '../../../constants/ModalKeys';
import BanProfileModal from './BanProfileModal';
import ChatHistoryModal from './ChatHistoryModal';
import MessageListModal from './MessageListModal';

class MyModal extends Component {
    render() {
        const { modalKey } = this.props;
        switch (modalKey) {
            case ModalKey.CHAT:
                return <ChatHistoryModal {...this.props} />;
            case ModalKey.BAN_PROFILE:
                return <BanProfileModal {...this.props} />;
            case ModalKey.MESSAGES:
                return <MessageListModal {...this.props} />;
            default:
                return null;
        }
    }
}

export default MyModal;