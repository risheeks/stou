const initialState = {
    auth_token: null,
    email: null,
    location: null
}

const loginReducer = function login(state = initialState, action) {
    switch (action.type) {
        // Push user authentication token to state
        case 'GET_AUTH_TOKEN': {
            return state = {
                ...state,
                auth_token: action.auth_token,
                email: action.email
            }
        }
        // Sign out of currently logged in account
        case 'SIGN_OUT': {
            return state = {
                ...state,
                auth_token: null,
                email: null
            }
        }
        case 'CHANGE_LOCATION': {
            return state = {
                ...state,
                location: action.location
            }
        }
        default:
            return state;
    }
}

export default loginReducer;