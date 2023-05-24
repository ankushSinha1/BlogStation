import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk'
import reducer from './reducers';

export * as actionCreator from './actionCreator/index';
export const store = createStore(reducer, {state: 'false'}, applyMiddleware(thunk));
