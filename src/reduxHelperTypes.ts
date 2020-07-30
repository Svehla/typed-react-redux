import { GlobalState, AllReduxActions } from "./App"

export type ThunkReturnType<R = Promise<unknown> | unknown, ExtraArgument = any> =(
  dispatch: <T = Promise<unknown> | unknown>(a: AllReduxActions | ThunkReturnType) => T,
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

