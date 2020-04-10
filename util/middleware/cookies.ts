import { serialize } from 'cookie'
import { NextApiResponse } from 'next'

export const cookie = (
  res: NextApiResponse,
  name: string,
  value: string,
  options: { [key: string]: any } = {}
) => {
  const stringValue =
    typeof value === 'object' ? 'j:' + JSON.stringify(value) : String(value)

  if ('maxAge' in options) {
    options.expires = new Date(Date.now() + options.maxAge)
    options.maxAge /= 1000
  }

  res.setHeader('Set-Cookie', serialize(name, String(stringValue), options))
}
