
// inspiration https://stackoverflow.com/a/57364353
export type Await<T> = T extends {
  then(onfulfilled?: (value: infer U) => unknown): unknown;
} ? U : T;

// inspiration: https://stackoverflow.com/a/51365037
export type RecursivePartial<T> = {
  [P in keyof T]?:
    // check that nested value is an array
    // if yes, apply RecursivePartial to each item of it
    T[P] extends (infer U)[] ? RecursivePartial<U>[] :
    T[P] extends object ? RecursivePartial<T[P]> :
    T[P];
};

export type ArrayItem<T> = T extends (infer U)[] ? U : T;