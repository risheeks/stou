export function openModal(modalKey, props) {
    return {
        type: 'OPEN_MODAL',
        modalKey: modalKey,
        props: props,
    }
}

export function closeModal() {
    return {
        type: 'CLOSE_MODAL'
    }
}
