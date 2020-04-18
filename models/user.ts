import jwt from 'jsonwebtoken'
import { User } from "~/types/api"

export class DobbleUser implements User {
  constructor (
    public id: string,
    public name: string
  ) {}

  static fromToken (token: string) {
    const { SECRET_KEY } = process.env
    if (!SECRET_KEY) throw new Error('Missing secret key env')

    const { id, name } = jwt.verify(token, SECRET_KEY) as { id: string, name: string }
    return new DobbleUser(id, name)
  }

  get toJSON () {
    const { name, id } = this
    return { name, id }
  }
}
