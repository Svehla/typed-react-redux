

import { ThunkAction } from "redux-thunk"
import { Action } from "redux"
import { GlobalState } from "./App"

export type ThunkReturnType <
  ActionT extends Action<string>,
  ReturnType=Promise<ActionT> | Promise<void> | void
> = ThunkAction<ReturnType, GlobalState, void, ActionT>

export type GetStateFromReducers<
  T extends ((...args: any[]) => any) | { [key: string]: any }
> = {
  [K in keyof T]: T[K] extends ((...args: any[]) => any)
    ? ReturnType<T[K]>
    : GetStateFromReducers<T[K]>
}

