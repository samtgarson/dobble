import { NextApiHandler } from 'next'
import { DataClient } from '~/src/services/data-client'

// eslint-disable-next-line react-hooks/rules-of-hooks
const client = new DataClient()

const handler: NextApiHandler = (req, res) => {
  return client.auth.api.setAuthCookie(req, res)
}

export default handler
