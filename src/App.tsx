import React from 'react';
import { createStore, applyMiddleware, Action } from 'redux'
import { useSelector, Provider, useDispatch } from 'react-redux'
import { combineReducers } from 'redux';
import thunk, { ThunkAction } from 'redux-thunk';

// helper generics
type GetStateFromReducers<T extends ((...args: any[]) => any) | { [key: string]: any }> = {
  [K in keyof T]: T[K] extends ((...args: any[]) => any)
    ? ReturnType<T[K]>
    : GetStateFromReducers<T[K]>
}

type ThunkReturnType <ActionT extends Action<string>, ReturnType=Promise<ActionT> | Promise<void> | void> =
  ThunkAction<ReturnType, GlobalState, void, ActionT>

// ---------------
// ---- utils ----
const delay = (timeout: number) => new Promise(resolve => setTimeout(resolve, timeout))

// ---------------
// counter reducer
// ---------------
const INCREMENT = 'INCREMENT' as const
const DECREMENT = 'DECREMENT' as const

const increment = () => ({
  type: INCREMENT,
})

const decrement = () => ({
  type: DECREMENT,
})

type ActionType = 
  | ReturnType<typeof increment>
  | ReturnType<typeof decrement>

type IncrementThunk = ThunkReturnType<ActionType>


export const asyncIncrement = (timeout: number): IncrementThunk =>
  async (dispatch, _getState) => {
    await delay(timeout)
    dispatch(increment())
    await delay(timeout)
    dispatch(increment())
  };
  
  
const defaultState = {
  value: 0
}
type State = typeof defaultState

function counter(state = defaultState, action: ActionType): State {
  switch (action.type) {
    case INCREMENT:
      return { ...state, value: state.value + 1 }
    case DECREMENT:
      return { ...state, value: state.value - 1 }
    default:
      return state
  }
}

// ----------------
// --- app init ---
// ----------------
const reducers = {
  // TODO: add reducers
  counter
};
// Create a Redux store holding the state of your app.
// Its API is { subscribe, dispatch, getState }.
let store = createStore(combineReducers(reducers), applyMiddleware(thunk))

type GlobalState = GetStateFromReducers<typeof reducers>

function App() {
  return (
    <Provider store={store}>
      <Counter />
    </Provider>
  );
}

// ----- sub component
const getCounterValue = (state: GlobalState) => state.counter.value

const Counter = () => {
  const dispatch = useDispatch()
  const counterValue = useSelector(getCounterValue)

  const increment = () => { dispatch(increment()) }
  const decrement = () => { dispatch(decrement()) }

  return (
    <div>
      {counterValue}
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={() => { dispatch(asyncIncrement(200))}}>make 200ms async increment</button>
      <button onClick={() => { dispatch(asyncIncrement(400))}}>make 400ms async increment</button>
      <button onClick={() => { dispatch(asyncIncrement(800))}}>make 800ms async increment</button>
    </div>
  )
}

export default App;
