const initialState = {
    baggedItems: [
        {
            id: 1,
            name: 'Spicy Fried Chicken',
            price: 10,
            quantity: 2
        },
        {
            id: 2,
            name: 'Big Mac',
            price: 2,
            quantity: 5
        }
    ]
}

const orderReducer = function order(state = initialState, action) {
    switch (action.type) {
        // Add item to bag
        case 'ADD_TO_ORDER': {
            const state = {
                ...state,
                baggedItems: [...state.baggedItems, action.newItem]
            }
            localStorage.setItem('baggedItems', state.baggedItems);
            return state;
        }
        // Remove item from bag
        case 'REMOVE_FROM_ORDER': {
            const state = {
                ...state,
                baggedItems: state.baggedItems.filter(item => item.id !== action.item.id)
            }
            localStorage.setItem('baggedItems', state.baggedItems);
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