import React, { Component } from 'react';
import { ModalKey } from '../../../constants/ModalKeys';
import ZipcodeModal from './ZipcodeModal';
import FoodModal from './FoodModal';
import OrderAlert from './OrderAlert';
import OrderModal from './OrderModal';
import MenuModal from './MenuModal'
import ResetPasswordModal from './ResetPasswordModal';

class MyModal extends Component {
    render() {
        const { modalKey } = this.props;
        switch (modalKey) {
            case ModalKey.ZIPCODE:
                return <ZipcodeModal {...this.props} />;
            case ModalKey.FOOD_ITEM:
                return <FoodModal {...this.props} />;
            case ModalKey.NEW_ORDER:
                return <OrderAlert {...this.props} />;
            case ModalKey.ORDER_STATUS:
                return <OrderModal {...this.props} />;
            case ModalKey.MENU_MODAL:
                return <MenuModal {...this.props} />;
            case ModalKey.RESET_PASSWORD:
                return <ResetPasswordModal {...this.props} />;
            default:
                return null;
        }
    }
}

export default MyModal;