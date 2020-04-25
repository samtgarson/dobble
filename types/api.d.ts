import { NextApiRequest, NextApiResponse } from "next"
import { Firestore } from "@google-cloud/firestore"
import Pusher from 'pusher'
import { DobbleUser } from '~/models/user'

export type User = {
  name: string
  id: string
}

export type DobbleApiRequest = NextApiRequest & {
  user: DobbleUser
  db: Firestore
  pusher: Pusher
  trigger: (channel: string, eventName: string, body: any) => Promise<void>
}

export type DobbleApiResponse = NextApiResponse & {
  error: (status: number, message?: string) => void
}

export type DobbleApiHandler = (req: DobbleApiRequest, res: DobbleApiResponse) => void
export type DobbleMiddleware = (req: DobbleApiRequest, res: DobbleApiResponse) => DobbleApiRequest | void
