import { useEffect } from 'react'
import * as Fathom from 'fathom-client'
import { useRouter } from 'next/router'

export const useFathom = (): void => {
  const router = useRouter()

  useEffect(() => {
    Fathom.load('KPUWCNUE', {
      url: 'https://prawn.samgarson.com/script.js',
      spa: 'auto',
      includedDomains: ['dobble.samgarson.com']
    })

    function onRouteChangeComplete() {
      Fathom.trackPageview()
    }

    router.events.on('routeChangeComplete', onRouteChangeComplete)

    return () => {
      router.events.off('routeChangeComplete', onRouteChangeComplete)
    }
  }, [])
}
