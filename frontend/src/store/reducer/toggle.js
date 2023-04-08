const initState = {
    "toggle": false,
    "toDispatchSpace": true
}

export const toggleReducer = (state = initState, action) => {
    switch (action.type) {
        case 'UPDATE_TOGGLE':
            return action.payload
        default:
            return state
    }
}