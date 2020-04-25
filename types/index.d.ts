export type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>

interface Fathom {
  (...args: any[]): void
  q?: Array<IArguments>
}

declare global {
  interface Window {
    fathom: Fathom
  }
}

declare module 'react' {
  interface ScriptHTMLAttributes<T> extends HTMLAttributes<T> {
    site?: string
  }
}
