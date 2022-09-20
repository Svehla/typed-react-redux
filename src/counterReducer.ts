import { defineReduck, reduxToolkitIsUseLess, ThunkReturnType } from './reduxHelperTypes';
import { delay } from './utils';

const defaultState = {
  value: 10
}

export const {
  actions: counterActions_OG,
  reducer: counterReducer_OG,
} = defineReduck(
  {
    multiply: (multiplyBy: number) => ({
      type: 'counter/MULTIPLY' as const,
      multiplyBy,
    }),

    divide: (divideBy: number) => ({
      type: 'counter/DIVIDE' as const,
      divideBy,
    })
  },

  defaultState,
 
  (state, action) => {
    switch (action.type) {
      case 'counter/MULTIPLY':
        return { ...state, value: state.value * action.multiplyBy }
      case 'counter/DIVIDE':
        return { ...state, value: state.value / action.divideBy }
      default:
        return state
    }
  }
)


export const {
  actions: counterActions,
  reducer: counterReducer,
} = reduxToolkitIsUseLess(
  'reduxToolkitIsUseLess__counter',

  defaultState,
  { 
    divide: (state, divideBy: number) => ({
      ...state,
      value: state.value / divideBy
    }),
    multiply: (state, multiplyBy: number) => ({
      ...state,
      value: state.value * multiplyBy
    })
  }
)


export const asyncValueChange = (timeout: number): ThunkReturnType =>
  async (dispatch, _getState) => {
    await delay(timeout)
    dispatch(counterActions.multiply(2))
    await delay(timeout)
    await delay(timeout)
    dispatch(counterActions.multiply(5))
    await delay(timeout)
    dispatch(counterActions.divide(7))
  };
  


