export function openModal(item) {
    return {
        type: 'OPEN_MODAL',
        item
    }
}

export function closeModal() {
    return {
        type: 'CLOSE_MODAL'
    }
}
