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

// -------------------------- Redux action type type as string validation -----------------------------------
// static type err thrower which check that you don't forget to ad `as const` into your redux action type name
type ThrowErrIfReduxActionTypeIsInvalid<U extends AllReduxActions['type']> = U
// @ts-expect-error if this throw error you have probably error in your reduck code and you forget to add as const notation
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type _TestAsConstForActionName = ThrowErrIfReduxActionTypeIsInvalid<'hey bro! you probably forget to add `as const` notation into your reduck file'>
