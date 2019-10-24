const initialState = {
    baggedItems: []
}

const orderReducer = function order(state = initialState, action) {
    switch (action.type) {
        // Add item to bag
        case 'ADD_TO_ORDER': {
            let existingItem = state.baggedItems.find( ({ id }) => id === action.newItem.id)
            if(existingItem) {
                existingItem.quantity += action.newItem.quantity;
                return state;
            }
            state = {
                ...state,
                baggedItems: [...state.baggedItems, action.newItem]
            }
            localStorage.setItem('baggedItems', JSON.stringify(state.baggedItems));
            return state;
        }
        // Remove item from bag
        case 'REMOVE_FROM_ORDER': {
            state = {
                ...state,
                baggedItems: state.baggedItems.filter(item => item.id !== action.itemId)
            }
            if(state.baggedItems.length < 1) {
                localStorage.removeItem('baggedItems');
            }
            else {
                localStorage.setItem('baggedItems', JSON.stringify(state.baggedItems));
            }
            console.log(state);
            return state;
        }
        case 'REFRESH': {
            return state = {
                ...state,
                baggedItems: action.baggedItems
            }
        }
        default:
            return state;
    }
}

export default orderReducer;