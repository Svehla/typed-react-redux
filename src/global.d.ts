import { AllReduxActions } from './App'

declare module 'react-redux' {
  type UnspecificReduxThunkAction = (...arg: any[]) => any
  export function useDispatch(): (
    arg: AllReduxActions | UnspecificReduxThunkAction
  ) => Promise<any>
}
