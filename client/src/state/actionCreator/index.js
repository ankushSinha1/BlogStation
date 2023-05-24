export const onLogin = (state)=> {
    return (dispatch) => 
    dispatch({
        type: 'LOGIN',
        payload: state,
    })
}
export const onLogout = (state) => {
    return (dispatch) => 
    dispatch({
        type: 'LOGOUT',
        payload: state,
    })
}