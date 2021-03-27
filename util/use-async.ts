import { useEffect } from 'react'

const allArePresent = (arr: unknown[] = []) => arr.every(i => typeof i !== undefined)

export function useAsyncFetch<T, D extends unknown[]> (
  fetcher: () => (Promise<T> | undefined),
  done: (data: T) => void,
  errorHandler?: (error: Error) => void,
  dependencies?: D
): void {
  const defaultErrorHandler = () => {}
  const handleError = errorHandler || defaultErrorHandler

  useEffect(() => {
    if (!allArePresent(dependencies)) return

    let mounted = true
    const run = async () => {
      try {
        const data = await fetcher()
        if (mounted && data) done(data)
      } catch (error) {
        handleError(error)
      }
    }

    run()
    return () => { mounted = false }
  }, dependencies)
}
