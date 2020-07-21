import { ThunkReturnType } from './helperTypes';

const MULTIPLY = 'counter/MULTIPLY' as const
const DIVIDE = 'counter/DIVIDE' as const

const multiply = (multiplyBy: number) => ({
  type: MULTIPLY,
  multiplyBy,
})

const divide = (divideBy: number) => ({
  type: DIVIDE,
  divideBy,
})

type ActionType = 
  | ReturnType<typeof multiply>
  | ReturnType<typeof divide>

type CounterThunk = ThunkReturnType<ActionType>

const delay = (timeout: number) => 
  new Promise(resolve => setTimeout(resolve, timeout))

export const asyncValueChange = (timeout: number): CounterThunk =>
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
  value: 0
}

type State = typeof defaultState

export const counterReducer = (state = defaultState, action: ActionType): State => {
  switch (action.type) {
    case MULTIPLY:
      return { ...state, value: state.value * action.multiplyBy }
    case DIVIDE:
      return { ...state, value: state.value / action.divideBy }
    default:
      return state
  }
}
