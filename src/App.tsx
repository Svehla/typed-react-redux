import React from 'react';
import { createStore, applyMiddleware} from 'redux'
import { Provider } from 'react-redux'
import { combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { counterReducer } from './counterReducer'
import { GetStateFromReducers } from './helperTypes';
import { UIApp } from './UIApp';
import { usersReducer } from './usersReducer';

// ------------------
// --- init redux ---
// ------------------
const reducers = {
  counter: counterReducer,
  users: usersReducer
};

export type GlobalState = GetStateFromReducers<typeof reducers>

let store = createStore(combineReducers(reducers), applyMiddleware(thunk))

// init whole react app
export const App = () => (
  <Provider store={store}>
    <UIApp />
  </Provider>
);

