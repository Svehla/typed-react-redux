

# Typescript, 100% type-safe react-redux under 20 lines

## TLDR:
We’re gonna implement a `static-type` layer on top of the **Redux App**. Our goal is to write a minimalistic but 100% type-safe code. To do it well, we‘re gonna write code that will be more about type inferring and creating the data connection than about writing types.


Final source-code usage previews:

### Inferred redux state from reducers

```typescript
const reducers = {
  users: usersReducer,
  helpers: combineReducers({
    counter: counterReducer,
  }),
};

export type GlobalState = GetStateFromReducers<typeof reducers>
```


![Preview 1](https://raw.githubusercontent.com/Svehla/typed-react-redux/master/imgs/preview-1.png)


### Inferred union of all possible redux actions

```typescript
const reducers = {
  users: usersReducer,
  helpers: combineReducers({
    counter: counterReducer,
  }),
};

export type AllReduxActions = GetAllReduxActions<typeof reducers>

```

![get all redux actions](https://raw.githubusercontent.com/Svehla/typed-react-redux/master/imgs/getAllReduxActions.png)


### Inferred returned value of selectors


```typescript
const getCounterValue = (state: GlobalState) => state.helpers.counter.value
```

![get coutner value](https://raw.githubusercontent.com/Svehla/typed-react-redux/master/imgs/getCounterValue.png)


```typescript
const counterValue = useSelector(getCounterValue)
```

![Counter value](https://raw.githubusercontent.com/Svehla/typed-react-redux/master/imgs/counterValue.png)


### Inferred nested action payload by action type inside of reducer switch-case
![counter reducer](https://raw.githubusercontent.com/Svehla/typed-react-redux/master/imgs/counter-reducer.gif)

You can find the full redux-typescript app in my GitHub repository:
https://github.com/Svehla/redux-ts-preview



### Prerequisites
If you're not 100% sure about your Typescript skills you can check these beginner sources:

Basic static types inferring:
- https://dev.to/svehla/typescript-inferring-stop-writing-tests-avoid-runtime-errors-pt1-33h7
- More advanced generics: https://dev.to/svehla/typescript-generics-stop-writing-tests-avoid-runtime-errors-pt2-2k62



# Let's start

You could ask yourself. “***We can just read the official documentation and that’s it, right?” ***Unfortunately, the [official Redux Typescript guide](https://redux.js.org/recipes/usage-with-typescript) is not suitable for our inferring mindset.

In my humble opinion, the official React-Redux guide contains a lot of programming bottlenecks like repeatable code and a lot of abstraction and complexity. I don’t recommend to be inspired by that, you should just prefer **to continue with reading this Typescript article**.

Redux is a simple tool that is used to handle state management in modern web apps. Unfortunately Redux has some patterns which add a lot of unnecessary abstraction for a simple state management library. You have to create tons of functions that communicate over one black-box (Redux) which takes them all and makes some state changes and updates. Another problem with Redux is that there are no statically-analyzed source code connections, so you as a programmer don’t see dependencies and relationships between your Javascripts objects and functions. It’s like throwing functions into the air and check if it all works correctly. Of course Redux has a lot of useful features so it’s not bad at all. For example, Redux dev-tools are nice and you can simply use them as there are. Redux is also useful for large teams. Especially in a place where a lot of people contribute to the same repository at the same time.

Let’s have a look at Redux architecture. There are some `middlewares`, `reducers`, `selectors`, `actions`, `thunks` and at top of it, there is a `Redux` the black-box library which merges all pieces together and creates a global store.

In the diagram below we have the basic Redux data flow.

![redux flow](https://raw.githubusercontent.com/Svehla/typed-react-redux/master/imgs/redux-flow.jpeg)

Data flow is simple and straightforward, which is awesome right?

So let’s have a look at another diagram, which shows the basics of Javascript source code relations with the usage of Redux.

![redux flow](https://raw.githubusercontent.com/Svehla/typed-react-redux/master/imgs/redux-flow-2.png)

Redux forces you to write a lot of small functions that are all merged together in the heart of the Redux library, so it’s hard to do static-analyses and find relations between these pieces of abstractions

## Let’s add static-types

So our target is to create some *Typescript glue* that connects all these abstract parts (sectors, actions creators, reducers, etc…) together and makes Redux statically-analyzable, readable and type-safe.

Code snippets from this article are from this react-typescript repo:
[https://github.com/Svehla/redux-ts-preview](https://github.com/Svehla/redux-ts-preview)

### Action creators

Action creators are functions that return a new object that is dispatched into Redux.

```typescript
const MULTIPLY = 'MULTIPLY' as const 
const DIVIDE = 'DIVIDE' as const
const multiply = (multiplyBy: number) => ({
  type: MULTIPLY,
  multiplyBy,
})
const divide = (divideBy: number) => ({
  type: DIVIDE,
  divideBy,
})
```

We’re gonna add a few Typescript types which help us to create data-types for action creators.

1. We have to use `as const` for setting up action names like the enum value for future pattern-matching.
2. We have to add types for function arguments
3. We create `ActionsType` enum which enables us to logically connect actions to a reducer.

```typescript
// global uniq names
// use `as const` for fixing value of type
const MULTIPLY = 'MULTIPLY' as const
const DIVIDE = 'DIVIDE' as const
const multiply = (multiplyBy: number) => ({
  type: MULTIPLY,
  multiplyBy,
})
const divide = (divideBy: number) => ({
  type: DIVIDE,
  divideBy,
})
// create options type for all action creators
// for one reducer. all data types are inferred
// from javascript so you don't have to
// synchronize types with implementations
type ActionType =
  | ReturnType<typeof multiply>
  | ReturnType<typeof divide>
```

### Reducer State

Each `reducer` has a state. Let’s define the basic one.

```typescript
const defaultState = {
  value: 10
}
```

We use Typescript as a glue for our Javascript code, we don’t want to reimplement the shape of the defaultState into an Interface by hand, because we trust our Javascript implementation. We will infer the type directly from the Javascript object.

```typescript
const defaultState = {
  value: 10
}
type State = typeof defaultState
```

![default state](https://raw.githubusercontent.com/Svehla/typed-react-redux/master/imgs/defaultState.png)

As you can see it’s no big deal to infer a static type for the whole reducer state by using a single `typeof` keyword. There is a bottleneck if a default value does not describe the whole data type and Typescript can’t infer it correctly. For example an empty array. If you write an empty array you have no idea what data types will be inside of the array. For this kind of case, we will help the typescript-compiler by using the `as` keyword for specifying the type correctly as in the example below.


```typescript
const defaultState = {
  users: [] as User[],
  admins: [] as User[],
}
type State = typeof defaultState
```

### Reducer

Reducer is a pure function that takes state and action and returns a new updated state. Basic Javascript implementation is just function with oneswitch caseas in the example.

```typescript
function counter(state = defaultState, action) {
  switch (action.type) {
    case MULTIPLY:
      return { ...state, value: state.value * action.multiplyBy }
    case DIVIDE:
      return { ...state, value: state.value / action.divideBy }
    default:
      return state
  }
}
```


Adding Typescript to the reducer is simple. We will just connect reducers arguments with already created Typescript inferred State type and an `ActionType` enum with all reducers actions.

![counter reducer](https://raw.githubusercontent.com/Svehla/typed-react-redux/master/imgs/counter-reducer-gif.gif)

You can see that `switch-case` pattern matching started to magically infer a data type from the return value of the action creator function.

### Combine reducers

`combineReducers` is a function that connects all the reducers into one giant nested object that is used as a global state which is a source of truth for the whole application. We know that a `reducer` returns an app `sub-state` which we inferred via `typeof` from the default `State`. So we are able to take the return value of all reducers and combine them to get the **state of the whole App**. For example:

```typescript
const reducers = {
  users: usersReducer,
  helpers: combineReducers({
    counter: counterReducer,
  }),
};
```

We will infer the App state by combing all reducers and apply the `GetStateFromReducers` generic which merges all reducers sub-states. `combineReducers` can be nest so our type inferring should works recursively. Generic `GetStateFromReducers` is a small `util` type that recursively `infer` returns values of all nested reducers and combines them into the global type.

```typescript
export type GetStateFromReducers<T> =
  T extends (...args: any[]) => infer Ret
  ? Ret
  : T extends Record<any, any>
  ? {
      [K in keyof T]: GetStateFromReducers<T[K]>
    }
  : T
```

Now we just apply our generic to the reducers object and infer the App state.

```typescript
const reducers = {
  users: usersReducer,
  helpers: combineReducers({
    counter: counterReducer,
  }),
};

export type GlobalState = GetStateFromReducers<typeof reducers>
```


![Global state](https://raw.githubusercontent.com/Svehla/typed-react-redux/master/imgs/globalState.png)


If you add a new reducer into the Javascript implementation, Typescript automatically infers a new global state. So there are no duplicates of writing **interfaces** and **implementation** because everything is automatically inferred.

### Selectors

Redux selector is a small function that takes global Redux state and picks some sub-state from it.

```typescript
const getCounterValue = (state: GlobalState) => state.helpers.counter.value
```

![Get counter value](https://raw.githubusercontent.com/Svehla/typed-react-redux/master/imgs/getCounterValue.png)

Now we connect the created selector to the React component by the `useSelector` hook.

```typescript
const counterValue = useSelector(getCounterValue)
```


![Counter value](https://raw.githubusercontent.com/Svehla/typed-react-redux/master/imgs/counterValue.png)

### Typescript connections preview

When you inferred the whole Redux state from the real Javascript implementation you get extra Typescript code connections between `selectors` and `reducers`. You can check it in your favorite IDE *(I use VSCode)* just by clicking something like a `command/CMD + mouse click` to data-type and IDE should jump to the code definition. If you try to do it the newly created example, an IDE will be redirected directly to the core implementation.

```typescript
export const UIApp = () => {
  const dispatch = useDispatch()
  return (
    <div>
      <button onClick={() => { dispatch(divide(4))}}>divide by 4</button>
    </div>
  )
}
```

It means that type inferring is much more valuable than just type interfaces written by hand! And you get it because you did not create an extra layer of a data shape abstraction and you just infer connections between your functions and objects.

### Dispatch action directly from the React Component

You already created all redux actions so we’re gonna connect them with React Component. In pure React Javascript, code will be similar to this one.

![React component](https://raw.githubusercontent.com/Svehla/typed-react-redux/master/imgs/react-component.png)

We use the `useDispatch` hook to get `dispatch` function. `dispatch` takes action object which is created by our action creators (later in this chapter you will find out that you can pass also redux-thunk function). We want to create a union type for all possible Redux actions. We already combined all reducers together by combineReducer. So we will just take a second argument (action) of all reducers and get a union type for all of them.

We define another generic which recursively infer the second argument of all nested functions in objects.

```typescript
export type GetAllReduxActions<T> = T extends (state: any, actions: infer Actions, ...args: any[]) => any
  // omit empty objects like `{}`
  ? keyof Actions extends []
    ? never
    : Actions
  : T extends Record<string, infer Values>
  ? GetAllReduxActions<Values>
  : never

```


Now we pass `typeof reducers` into generic and we get `union` of all possible actions!

```typescript
const reducers = {
  users: usersReducer,
  helpers: combineReducers({
    counter: counterReducer,
  }),
};

export type AllReduxActions = GetAllReduxActions<typeof reducers>

```
![All Redux Actions](https://raw.githubusercontent.com/Svehla/typed-react-redux/master/imgs/allReduxActions.png)

![Redux action types](https://raw.githubusercontent.com/Svehla/typed-react-redux/master/imgs/reduxActionTypes.png)

The last step is to re-declare a global data type for `react-redux` library and connect created `AllReduxActions` type to the `useDispatch` hook.

To do that we have to create `global.d.ts` a file where we replace libraries definitions with our custom ones. In this file, we redeclare the scope of `react-redux` library and change the Typescript type of `useDispatch`. We redeclare react-redux types by using of `declare module xxx {` You can read more about adding types to different modules there:
https://www.typescriptlang.org/docs/handbook/modules.html#ambient-modules

```typescript
import { AllReduxActions } from './App'
import { ThunkReturnType } from './reduxHelperTypes'

declare module 'react-redux' {
  type UnspecificReduxThunkAction = (...arg: any[]) => any
  export function useDispatch(): (arg: AllReduxActions | UnspecificReduxThunkAction) => Promise<any>
}
```

*In this `global.d.ts` we already added support for `redux-thunk` by `ThunkReturnType` generic which will be described in the next part of this article.*

We already defined all necessary pieces and we’re able to use `useDispatch` with a correctly typed all actions argument.

![Alt Text](https://raw.githubusercontent.com/Svehla/typed-react-redux/master/imgs/dispatch.png)

**arg arguments contain all users/ and count/ actions but this union type is too large to be in one screenshot*

### Async actions with `redux-thunk`

The last missing thing from our Redux example is `async` action dispatching. For this article, we choose to use [`redux-thunk`](https://www.npmjs.com/package/redux-thunk) library because it’s a simple package that is heavily used in the whole Redux ecosystem.

Redux-thunk enables us to write a function that takes custom parameters and returns a new function with pointers to `dispatch` and `getState` functions that enable you to create `async` Redux work-flow. If you don’t know `redux-thunk` look at the documentation. https://github.com/reduxjs/redux-thunk

A basic Javascript `redux-thunk` `async` function example.

```typescript
const delay = (timeout) => new Promise(resolve => setTimeout(resolve, timeout))

export const asyncValueChange = (timeout) =>
  async (dispatch, _getState) => {
    await delay(timeout)
    dispatch(multiply(2))
    await delay(timeout)
    await delay(timeout)
    dispatch(multiply(5))
    await delay(timeout)
    dispatch(divide(7))
  };
```


![Alt Text](https://raw.githubusercontent.com/Svehla/typed-react-redux/master/imgs/thunk.png)

It would be a lot of work to write types for each function argument. Because of that, we created another `util` generic calledThunkReturnType which adds static types for the whole thunk function. The definition is relatively simple.

```typescript
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
```

Our final `async` thunk function is almost the same as the previous one written in pure Javascript. We just add `ThunkReturnType` static type for the returned `async` function.

![Thunk infer type](https://raw.githubusercontent.com/Svehla/typed-react-redux/master/imgs/thunk-infer-type.gif)

Now you connected Javascript React Redux App with 100% type-safe Typescript types.

### What’s next? 🎉🎉

Well… That’s all!

You have a fully typed Redux application with almost minimum effort of writing types! Anytime you create a new `actions`/`reducers`/`sub-state`/etc… almost all data-types and data-connections are automatically inferred and your code is type-safe, analyzable, and well self-documented.

The full type-safe React Redux app GitHub repo: https://github.com/Svehla/redux-ts-preview

### Conclusion

We learned how to use advanced Typescript types and skip redundant static-type definitions. We used Typescript as a static compile-time type checker which infer types from Javascript business logic implementation. In our Redux example, we logically merged `reducers` with `actions`, `combined-reducers` with `state` and `state` with `selectors`. And the top of that, we support to dispatch `async` actions via the `redux-thunks` library.

In the diagram below we can see that all functions related to Redux have statically analyzed connections with the rest of the code. And we can use that feature to make consistent APIs between objects and redux functions.

![new redux architecture](https://raw.githubusercontent.com/Svehla/typed-react-redux/master/imgs/new-redux-architecture.png)

*Diagram Legend*:
**Blue lines** — Typescript— **the connections “glue” of functions and objects

I hope that you have read all 3 parts of this series and you slightly changed your mindset on how to write static types in the Javascript ecosystem with the help of awesome tools which Typescript provides to us.

Do you disagree with these Articles? Don’t be afraid to start a conversation below. 💪

You can find the full redux-typescript app in this repository:
https://github.com/Svehla/redux-ts-preview

*If you enjoyed reading the article don’t forget to like it.*
