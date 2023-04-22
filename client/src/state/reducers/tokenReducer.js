const tokenReducer = (state={token: '', user: ''}, action) => {
    if(action.type === 'LOGIN'){
        return {...state,
            token: action.payload.token,
            user: action.payload.user,
        };
    }else if(action.type === 'LOGOUT'){
        return (state.token = '', state.user='');
    }else{
        return state;
    }
}
export default tokenReducer;