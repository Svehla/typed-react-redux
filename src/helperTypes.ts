
// inspiration https://stackoverflow.com/a/57364353
export type Await<T> = T extends {
  then(onfulfilled?: (value: infer U) => unknown): unknown;
} ? U : T;

// inspiration: https://stackoverflow.com/a/51365037
export type RecursivePartial<T> = 
T extends (infer Item)[]
  ? RecursivePartial<Item>[] | undefined
  : T extends Record<string, any>
  ? { [P in keyof T]?: RecursivePartial<T[P]> }
  : T

export type ArrayItem<T> = T extends (infer U)[] ? U : T;