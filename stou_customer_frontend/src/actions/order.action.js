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

export function addToOrder(item, quantity) {
    return {
        type: 'ADD_TO_ORDER',
        newItem: { item, quantity }
    }
}

export function refresh() {
    const baggedItems = localStorage.getItem('baggedItems');
    if (baggedItems) {
        return {
            type: 'REFRESH',
            baggedItems: baggedItems
        }
    }
    return {
        type: 'REFRESH',
        baggedItems: initialState.baggedItems
    }
}

export function removeFromOrder(item) {
    return {
        type: 'REMOVE_FROM_ORDER',
        item: item
    }
}