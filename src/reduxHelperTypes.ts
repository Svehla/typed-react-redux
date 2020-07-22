import { GlobalState, AllReduxActions } from "./App"
import { ThunkDispatch } from "redux-thunk";

export type ThunkReturnType<R = Promise<unknown>, ExtraArgument = any> =(
  dispatch: ThunkDispatch<GlobalState, void, AllReduxActions>,
  getState: () => GlobalState,
  extraArgument: ExtraArgument
) => R 

export type GetStateFromReducers<
  T extends ((...args: any[]) => any) | { [key: string]: any }
> = {
  [K in keyof T]: T[K] extends ((...args: any[]) => any)
    ? ReturnType<T[K]>
    : GetStateFromReducers<T[K]>
}

export type Get2NestedValuesAsUnion<T> =
  T extends ({ [s: string]: infer ValNest1 })
    ? ValNest1 extends ({ [s: string]: infer ValNest2 })
      ? ValNest2
      : ValNest1
    : T

export type GetActionsFromReducer<T> =
  T extends ((...args: any[]) => any)
    ? Parameters<T>[1]
    : never
