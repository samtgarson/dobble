export type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>

interface Fathom {
  (...args: any[]): void
  q?: Array<IArguments>
}

declare global {
  interface Window {
    fathom: Fathom
  }

  type ShareOptions = { title: string, text?: string, url: string }
  type NavigatorShare = (options: ShareOptions) => Promise<{}>

  interface Navigator {
    share?: NavigatorShare
  }
}

declare module 'react' {
  interface ScriptHTMLAttributes<T> extends HTMLAttributes<T> {
    site?: string
  }
}
