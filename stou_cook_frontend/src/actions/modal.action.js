export function openModal(modalKey) {
    return {
        type: 'OPEN_MODAL',
        modalKey: modalKey,
    }
}

export function closeModal() {
    return {
        type: 'CLOSE_MODAL'
    }
}
