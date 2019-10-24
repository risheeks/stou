const initialState = {
    showModal: false,
    modalKey: null,
}

const modalReducer = function modal(state = initialState, action) {
    switch (action.type) {
        case 'OPEN_MODAL': {
            return state = {
                showModal: true,
                modalKey: action.modalKey,
            };
        }
        case 'CLOSE_MODAL': {
            return state = {
                showModal: false,
                modalKey: null,
            };
        }
        default:
            return state;
    }

}

export default modalReducer;