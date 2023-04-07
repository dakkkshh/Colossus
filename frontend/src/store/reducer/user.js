const initState = {
    jwtToken: '',
    _id: '',
    name: '',
    email: '',
    role: '',
    organization: '',  
};

export const userReducer = (state = initState, action) => {
    switch (action.type) {
        case 'LOGIN': {
            return action.payload
        }
        case 'LOGOUT':
            return ({});
        default: 
            return state;
    }
}