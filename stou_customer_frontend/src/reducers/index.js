import { combineReducers } from 'redux';
import modalReducer from './modal.reducer';
import loginReducer from './login.reducer';
import orderReducer from './order.reducer';

export default combineReducers({
    modalReducer,
    loginReducer,
    orderReducer,
});
