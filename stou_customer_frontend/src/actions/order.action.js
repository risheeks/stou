const initialState = {
    baggedItems: []
}

export function addToOrder(item, quantity) {
    return {
        type: 'ADD_TO_ORDER',
        newItem: { ...item, quantity }
    }
}

export function refresh() {
    
    if (localStorage.hasOwnProperty('baggedItems') && localStorage.getItem('baggedItems').length > 0) {
        let baggedItems = JSON.parse(localStorage.getItem('baggedItems'));
        if (baggedItems) {
            return {
                type: 'REFRESH',
                baggedItems: baggedItems
            }
        }
    }
    localStorage.setItem('baggedItems', JSON.stringify([]));
    return {
        type: 'REFRESH',
        baggedItems: initialState.baggedItems
    }
}

export function removeFromOrder(id) {
    return {
        type: 'REMOVE_FROM_ORDER',
        id: id
    }
}

export function clearOrder() {
    localStorage.setItem('baggedItems', JSON.stringify([]));
    return {
        type: 'CLEAR_ORDER'
    }
}