import RoomService from "@roomservice/node"
import {AuthMiddleware} from "~/util/middleware/auth"
// import {cookie} from "~/util/middleware/cookies"

const RoomServiceAuth = AuthMiddleware(async (req, res, user) => {
  if (!process.env.ROOM_SERVICE_SECRET) throw new Error('Missing room service secret')
  if (req.method !== 'POST') {
    res.statusCode = 405
    res.end()
    return
  }

  const client = new RoomService(process.env.ROOM_SERVICE_SECRET)
  const rsUser = { name: user.name, reference: user.id }

  try {
    const { room: { reference } } = client.parseBody(req.body)
    const { room, session } = await client.authorize({
      user: rsUser,
      room: { reference }
    })

    // cookie(res, session.name, session.token, { path: '/' })
    res.status(200).json({ user: rsUser, room, session })
  } catch (e) {
    console.error(e)
    res.status(500).end()
  }
})

export default RoomServiceAuth
