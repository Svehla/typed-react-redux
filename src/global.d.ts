import { AllReduxActions } from './App'
import { ThunkReturnType } from './reduxHelperTypes'



declare module 'react-redux' {
  export function useDispatch(): (
    arg: AllReduxActions | ThunkReturnType
  ) => Promise<unknown> | unknown
}



