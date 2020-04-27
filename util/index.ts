export const shuffle = <T>(a: T[]) => a
  .sort(() => 0.5 - Math.random())

export const fi = <T extends any | undefined, R>(conditional: T, result: R): R | undefined => {
  if (conditional) return result
}

export const getTimeLeft = (dateStr: string | undefined) => {
  if (!dateStr) return 0
  const date = new Date(dateStr)
  const diff = date.valueOf() - Date.now()
  return Math.floor((diff / 1000) % 60)
}

