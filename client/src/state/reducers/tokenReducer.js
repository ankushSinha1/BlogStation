const tokenReducer = (state='false', action) => {
    if(action.type === 'LOGIN'){
        return {state:action.payload};
    }else if(action.type === 'LOGOUT'){
        return {state: action.payload};
    }else{
        return state;
    }
}
export default tokenReducer;