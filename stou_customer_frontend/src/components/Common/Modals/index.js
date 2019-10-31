import React, { Component } from 'react';
import { ModalKey } from '../../../constants/ModalKeys';
import ZipcodeModal from './ZipcodeModal';
import FoodModal from './FoodModal';
import ProfileModal from './ProfileModal';
import MenuModal from './MenuModal';
import OrderModal from './OrderModal';
import OrderUpdateModal from './OrderUpdateModal';

class MyModal extends Component {
    render() {
        console.log(this.props);
        const { modalKey } = this.props;
        switch (modalKey) {
            case ModalKey.ZIPCODE:
                return <ZipcodeModal {...this.props} />;
            case ModalKey.FOOD_ITEM:
                return <FoodModal {...this.props} />;
            case ModalKey.PROFILE:
                return <ProfileModal {...this.props} />;
            case ModalKey.MENU:
                return <MenuModal {...this.props} />;
            case ModalKey.ORDER_STATUS:
                return <OrderModal {...this.props} />;
            case ModalKey.ORDER_UPDATE:
                return <OrderUpdateModal {...this.props} />;
            default:
                return null;
        }
    }
}

export default MyModal;