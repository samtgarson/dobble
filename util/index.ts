export const shuffle = <T>(a: T[]) => a
  .sort(() => 0.5 - Math.random())
