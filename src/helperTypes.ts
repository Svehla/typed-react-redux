
export type Await<T> = T extends Promise<infer Value> 
  ? Value
  : never

export type DeepPartial<T> = T extends Record<string, any>
  ? {
    [Key in keyof T]?: DeepPartial<T[Key]>
  }
  : T extends (infer Item)[]
    ? DeepPartial<Item>[] | undefined
  : T | undefined

