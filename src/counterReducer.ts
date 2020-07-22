import { ThunkReturnType } from './reduxHelperTypes';


export const multiply = (multiplyBy: number) => ({
  type: 'counter/MULTIPLY' as const,
  multiplyBy,
})

export const divide = (divideBy: number) => ({
  type: 'counter/DIVIDE' as const,
  divideBy,
})

type ActionType = 
  | ReturnType<typeof multiply>
  | ReturnType<typeof divide>

const delay = (timeout: number) => 
  new Promise(resolve => setTimeout(resolve, timeout))

export const asyncValueChange = (timeout: number): ThunkReturnType =>
  async (dispatch, _getState) => {
    await delay(timeout)
    dispatch(multiply(2))
    await delay(timeout)
    await delay(timeout)
    dispatch(multiply(5))
    await delay(timeout)
    dispatch(divide(7))
  };
  
const defaultState = {
  value: 10
}

type State = typeof defaultState

export const counterReducer = (state = defaultState, action: ActionType): State => {
  switch (action.type) {
    case 'counter/MULTIPLY':
      return { ...state, value: state.value * action.multiplyBy }
    case 'counter/DIVIDE':
      return { ...state, value: state.value / action.divideBy }
    default:
      return state
  }
}
