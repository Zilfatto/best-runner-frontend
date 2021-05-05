import { createStore, applyMiddleware } from 'redux';
import rootReducer from './rootReducer';
import thunk from 'redux-thunk';

// Function for configuring store
export default () => createStore(
    rootReducer,
    applyMiddleware(thunk)
);