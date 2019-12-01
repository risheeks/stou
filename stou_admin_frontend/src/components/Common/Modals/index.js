import React, { Component } from 'react';
import { ModalKey } from '../../../constants/ModalKeys';
import BanProfileModal from './BanProfileModal';

class MyModal extends Component {
    render() {
        console.log(this.props);
        const { modalKey } = this.props;
        switch (modalKey) {
            case ModalKey.CHAT:
                return null;
            case ModalKey.BAN_PROFILE:
                return <BanProfileModal {...this.props} />;
            default:
                return null;
        }
    }
}

export default MyModal;