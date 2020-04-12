declare module 'yawg' {
  export interface YawgOptions {
    delimiter?: string = ' '
    minLength?: number = 12
    maxLength?: number = 25
    minWords?: number = 3
    maxWords?: number = 5
    minWordLength? = 1
    maxWordLength? = 8
    attempts?: number = 1e4
  }

  export default function yawg(YawgOptions): string
}
