import { NextApiHandler } from "next"
import { DataClient } from "~/src/services/data-client"

const client = DataClient.useClient()

const handler: NextApiHandler = (req, res) => {
  return client.auth.api.setAuthCookie(req, res)
}

export default handler
