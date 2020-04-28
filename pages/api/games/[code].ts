import { MiddlewareStack } from '~/util/middleware'
import { getGame } from '~/services/api/get-game'
import { updateGame } from '~/services/api/patch-game'

export default MiddlewareStack(async (req, res) => {
  const { code } = req.query as { code: string }


  switch (req.method) {
    case 'GET':
      return getGame(req, code, res)
    case 'PATCH':
      return updateGame(req, code, res)
    default:
      return res.error(405, 'Wrong method')
  }
})
