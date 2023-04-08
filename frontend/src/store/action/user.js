export const login = (userInfo) => ({
    type: 'LOGIN',
    payload: userInfo
});

export const logout = () => ({
    type: 'LOGOUT'
});