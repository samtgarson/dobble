import {NextApiRequest, NextApiResponse} from "next";

export type User = {
  name: string
  id: string
}

export type HandlerWithUser = (req: NextApiRequest, res: NextApiResponse, user: User) => void
