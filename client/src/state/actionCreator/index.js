export const onLogin = (token, user, msg)=> {
    return (dispatch) => 
    dispatch({
        type: 'LOGIN',
        payload: {token, user, msg},
    })
}
export const onLogout = (token, user, msg) => {
    return (dispatch) => 
    dispatch({
        type: 'LOGOUT',
        payload: {token, user, msg},
    })
}