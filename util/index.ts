export const shuffle = <T>(a: T[]) => a
  .sort(() => 0.5 - Math.random())

export const fi = <T extends any | undefined, R>(conditional: T, result: R): R | undefined => {
  if (conditional) return result
}

