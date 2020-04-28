import { User } from "./api"
import { Omit } from './index'
import { Timestamp } from "@google-cloud/firestore"

export type UpdateGame = (cb: (state: Game) => void) => void

export enum GameStatus {
  Open = 'open',
  Playing = 'playing',
  Finished = 'finished',
  Closed = 'closed'
}

export type Card = number[]

export type Deck = Card[]

export type Player = User & {
  hand: Deck
}

export type FirebasePlayer = User & {
  hand: string[]
}

export interface Game {
  state: GameStatus
  code: string
  owner: string
  players: {
    [id: string]: Player
  }
  stack: Deck
  startedAt: string | null
  finishedAt: string | null
  createdAt: string
  winner: string | null
}

export interface FirebaseGame extends Omit<Game, 'stack' | 'players' | 'startedAt' | 'finishedAt' | 'createdAt'> {
  stack: string[]
  players: {
    [id: string]: FirebasePlayer
  }
  startedAt: Timestamp | null
  finishedAt: Timestamp | null
  createdAt: Timestamp
}
