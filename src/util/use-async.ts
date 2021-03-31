import { useEffect } from 'react'

type Deps = Record<string, unknown | undefined>

const allArePresent = <Hsh extends Deps>(hsh?: Hsh): hsh is Required<Hsh> => {
  if (!hsh) return false
  return Object.values(hsh).every(i => typeof i !== 'undefined' && i !== null)
}

export function useAsyncFetch<T, D extends Deps> (
  fetcher: (deps: Required<D>) => (Promise<T> | undefined),
  done: (data: T) => void,
  errorHandler?: ((error: Error) => void) | null,
  dependencies?: D
): void {
  const defaultErrorHandler = () => {}
  const handleError = errorHandler || defaultErrorHandler

  useEffect(() => {
    if (!allArePresent(dependencies)) return

    let mounted = true
    const run = async () => {
      try {
        const data = await fetcher(dependencies)
        if (mounted && data) done(data)
      } catch (error) {
        handleError(error)
      }
    }

    run()
    return () => { mounted = false }
  }, Object.values(dependencies ?? []))
}
