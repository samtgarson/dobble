import { DobbleApiRequest, DobbleMiddleware } from "~/types/api"
import { DobbleUser } from '~/models/user'

export const AuthMiddleware: DobbleMiddleware = (req, res) => {
  const dReq = req as DobbleApiRequest
  const { authorization: token } = req.headers

  if (!token) {
    return res.error(400, 'Authorization token required')
  }

  try {
    dReq.user = DobbleUser.fromToken(token)
    return dReq
  } catch (e) {
    res.error(401, 'Not authorized')
    return
  }
}

