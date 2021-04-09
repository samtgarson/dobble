import { differenceInSeconds } from "date-fns"

export const shuffle = <T>(a: T[]): T[] => a
  .sort(() => 0.5 - Math.random())

export const fi = <T extends unknown | undefined, R>(conditional: T, result: R): R | undefined => {
  if (conditional) return result
}

export const getTimeLeft = (fromDate?: Date, toDate?: Date): number => {
  if (!fromDate) return 0

  return differenceInSeconds(fromDate, toDate ?? new Date())
}

export const medals = ['🥇', '🥈', '🥉']

export const pluralize = (n: number, s1: string, smany: string): string => n == 1 ? `${n} ${s1}` : `${n} ${smany}`
