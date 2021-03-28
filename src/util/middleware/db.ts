import { DobbleApiRequest, DobbleMiddleware } from "~/types/api"
import Admin from 'firebase-admin'

const { FIREBASE_SERVICE_ACCOUNT } = process.env
if (!FIREBASE_SERVICE_ACCOUNT) throw new Error('Missing Firebase Service Account')

const buff = Buffer.from(FIREBASE_SERVICE_ACCOUNT, 'base64')
const serviceAccount = JSON.parse(buff.toString('ascii'))
if (Admin.apps.length === 0) {
  Admin.initializeApp({
    credential: Admin.credential.cert(serviceAccount)
  })
}


export const DatabaseMiddleware: DobbleMiddleware = req => {
  const dReq = req as DobbleApiRequest

  dReq.db = Admin.firestore()

  return dReq
}

