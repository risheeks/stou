import React, { Component } from 'react';
import { ModalKey } from '../../../constants/ModalKeys';
import ZipcodeModal from './ZipcodeModal';
import FoodModal from './FoodModal';

class MyModal extends Component {
    render() {
        console.log(this.props);
        const { modalKey } = this.props;
        switch(modalKey) {
            case ModalKey.ZIPCODE:
                return <ZipcodeModal {...this.props} />;
            case ModalKey.FOOD_ITEM:
                return <FoodModal {...this.props} />;
            default:
                return null;
        }
    }
}

export default MyModal;