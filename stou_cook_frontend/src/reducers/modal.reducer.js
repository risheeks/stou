const initialState = {
    showModal: false,
    item: {}
}

const modalReducer = function modal(state = initialState, action) {
    switch (action.type) {
        case 'OPEN_MODAL': {
            return state = {
                showModal: true,
                item: action.item
            };
        }
        case 'CLOSE_MODAL': {
            return state = {
                showModal: false,
                item: {}
            };
        }
        default:
            return state;
    }

}

export default modalReducer;