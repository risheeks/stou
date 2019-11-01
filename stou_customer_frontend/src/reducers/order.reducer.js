const initialState = {
    baggedItems: []
}

const orderReducer = function order(state = initialState, action) {
    switch (action.type) {
        // Add item to bag
        case 'ADD_TO_ORDER': {
            let existingItem = state.baggedItems.find( ({ food_id }) => food_id === action.newItem.food_id)
            if(existingItem) {
                existingItem.quantity += action.newItem.quantity;
                localStorage.setItem('baggedItems', JSON.stringify(state.baggedItems));
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
                baggedItems: state.baggedItems.filter(item => item.food_id !== action.id)
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
        case 'CLEAR_ORDER': {
            return state = {
                ...state,
                baggedItems: []
            }
        }
        default:
            return state;
    }
}

export default orderReducer;