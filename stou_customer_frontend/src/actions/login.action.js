export function getToken(auth_token, email) {
    localStorage.setItem('auth_token', auth_token);
    localStorage.setItem('email', email);
    return {
        type: 'GET_AUTH_TOKEN',
        auth_token,
        email
    }
}

export function signOut() {
    localStorage.clear();
    return {
        type: 'SIGN_OUT'
    }
}

export function changeLocation(location) {
    return {
        type: 'CHANGE_LOCATION',
        location
    }
}

