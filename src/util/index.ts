export const shuffle = <T>(a: T[]): T[] => a
  .sort(() => 0.5 - Math.random())

export const fi = <T extends unknown | undefined, R>(conditional: T, result: R): R | undefined => {
  if (conditional) return result
}

export const getTimeLeft = (fromDateStr?: string, toDateStr?: string | null): number => {
  if (!fromDateStr) return 0

  const fromDate = Date.parse(fromDateStr)
  const toDate = toDateStr == null ? new Date().valueOf() : Date.parse(toDateStr)

  const diff = fromDate - toDate
  return Math.floor(diff / 1000)
}
