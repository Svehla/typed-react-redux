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


// typed thunk abstraction
export type GetActions <T> = T extends Record<any, (...args: any[]) => infer V> ? V : never

export const defineReduck = <S, A extends Record<string, (...args: any) => any>>(
  actions: A,
  defaultState: S,
  reducer: (state: S, actions: GetActions<A>) => S
) => ({
  actions,
  // apply default state
  reducer: (state: S = defaultState, actions: GetActions<A>) => reducer(state, actions),
})

export const createIdentitySelectors = <T extends Record<string, (s: GlobalState) => any>>(a: T) => a

// redux toolkit is useless shit example:
// TODO: check that action name does not include slash in the key name
export const reduxToolkitIsUseLess = <T extends string, S, K extends string, H extends Record<K, (state: S, payload: any) => S>>(
  uniqKey: T,
  defaultState: S,
  handlers: H
) => {
  const actionCreators = Object.fromEntries(Object.keys(handlers)
    .map(k => [k, (payload: any) => ({ type: `${uniqKey}/${k}`, payload })])) as // @ts-expect-error
    { [K in keyof H]: (payload: Parameters<H[K]>[1]) => ({ type: `${T}/${K}`, payload: Parameters<H[K]>[1] }) }
  const genericReducer = (state: S, action: any) => handlers[action.type.split('/').at(-1) as keyof H]?.(state, action.payload) ?? state
  return defineReduck(actionCreators, defaultState, genericReducer)
}


/*
// support for multiple arguments in the action creators

type OmitFirst <T> = T extends [infer F, ...infer Rest] ? Rest : never

// redux toolkit is useless shit example:
// TODO: check that action name does not include slash in the key name
export const reduxToolkitIsUseLess = <T extends string, S, K extends string, H extends Record<K, (state: S, ...payload: any[]) => S>>(
  uniqKey: T,
  defaultState: S,
  handlers: H
) => {
  // @ts-expect-error
  const actionCreators = Object.fromEntries(Object.keys(handlers)
    .map(k => [k, (...payload: any[]) => ({ type: `${uniqKey}/${k}`, payload })])) as 
    // @ts-expect-error
    { [K in keyof H]: (...payloads: OmitFirst<Parameters<H[K]>>) => ({ type: `${T}/${K}`, payload: OmitFirst<Parameters<H[K]>> }) }
  const genericReducer = (state: S, action: any) => handlers[action.type.split('/').at(-1) as keyof H]?.(state, ...action.payload) ?? state
  return defineReduck(actionCreators, defaultState, genericReducer)
}
*/
