import { combineReducers } from 'redux';
import modalReducer from './modal.reducer';
import loginReducer from './login.reducer';

export default combineReducers({
    modalReducer,
    loginReducer,
});
