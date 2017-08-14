import { STATUS_CODES } from 'http'
import { get } from 'object-path'
import { matches } from '../utils/pattern'

export default function (req, res, opts) {
  if (!opts) return

  if (opts.source && !matches(opts.source, req.uri)) {
    return
  }

  const authData = get(req, 'headers.authorization.0.value')
  if (!authData) {
    return notAuthorized(res)
  }

  const { username, password } = decode(authData)
  if (username !== opts.username || password !== opts.password) {
    return notAuthorized(res)
  }
}

export function notAuthorized (res) {
  Object.assign(res, {
    status: '401',
    statusDescription: STATUS_CODES['401'],
    body: 'You are not authorized',
    headers: {
      'content-type': [{
        key: 'Content-Type',
        value: 'text/plain; charset=UTF-8'
      }],
      'www-authenticate': [{
        key: 'WWW-Authenticate',
        value: 'Basic'
      }]
    }
  })
}

export function decode (value) {
  const token = value.replace(/^(?:\s+)?basic\s+/i, '')

  const [username, password] = Buffer
    .from(token, 'base64')
    .toString('utf-8')
    .split(':')

  return {
    username: String(username || ''),
    password: String(password || '')
  }
}
