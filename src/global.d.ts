import { AllReduxActions } from './App'
import { ThunkReturnType } from './reduxHelperTypes'

declare module 'react-redux' {
  export function useDispatch(): (
    arg: AllReduxActions | ThunkReturnType
  ) => Promise<unknown> | unknown
}

declare module 'redux' {
  // We rewrite default combineReducer behavior for simplify
  // of accessing of global redux state from redux selectors
  export function combineReducers<S>(
    reducers: S
  ): S
}