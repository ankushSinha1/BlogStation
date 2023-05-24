import {combineReducers} from 'redux';
import tokenReducer from './tokenReducer';
const reducer = combineReducers({
    login: tokenReducer
})
export default reducer;