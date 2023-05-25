const loginReducer = (state={isLoggedIn: false}, action) => {
    if(action.type === 'LOGIN'){
        return {...state, isLoggedIn: true};
    }else if(action.type === 'LOGOUT'){
        return  {...state, isLoggedIn: false};
    }else{
        return state;
    }
}
export default loginReducer;