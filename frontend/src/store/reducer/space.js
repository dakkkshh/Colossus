const initState = {
    "_id": "",
    "name": "",
    "isWifi": false,
    "isComputers": false,
    "isAc": false,
    "seats": [],
}

export const spaceReducer = (state = initState, action) => {
    switch (action.type) {
        case 'CHANGE_SELECTED_SPACE':
            return action.payload
        default:
            return state
    }
}