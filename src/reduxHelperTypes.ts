import { GlobalState, AllReduxActions } from "./App"

export type ThunkReturnType<
  R = Promise<unknown> | unknown,
  ExtraArgument = any
> =(
  dispatch: <T = Promise<unknown> | unknown>(
    a: AllReduxActions | ThunkReturnType
  ) => T,
  getState: () => GlobalState,
  extraArgument: ExtraArgument
) => R 


export type GetStateFromReducers<T> =
  T extends (...args: any[]) => infer Ret
  ? Ret
  : T extends Record<any, any>
  ? {
      [K in keyof T]: GetStateFromReducers<T[K]>
    }
  : T

export type GetAllReduxActions<T> = T extends (state: any, actions: infer Actions, ...args: any[]) => any
  // omit empty objects like `{}`
  ? keyof Actions extends []
    ? never
    : Actions
  : T extends Record<string, infer Values>
  ? GetAllReduxActions<Values>
  : never
