import { User } from "./api"

export type Card = number[]

export type Deck = Card[]

export type Player = User & {
  hand: Deck
  game_id: string
}
