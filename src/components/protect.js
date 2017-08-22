import { STATUS_CODES } from 'http'
import { get } from '../utils/deep'
import { match } from '../utils/pattern'

export default function (req, res, data) {
  if (!data) {
    return
  }

  if (typeof data !== 'object') {
    throw new TypeError('"protect" must be an object')
  }

  /* skip if route doesn't match (if there's a source) */
  if (data.source && !match(data.source, req.uri)) {
    return
  }

  /* get auth token from the header */
  const authData = get(req, 'headers.authorization.0.value')

  /* no token === no authorization */
  if (!authData) {
    return notAuthorized(res)
  }

  /* decode token into basic credentials */
  const { username, password } = decode(authData)

  /* verify credentials */
  if (username !== data.username || password !== data.password) {
    return notAuthorized(res)
  }
}

/**
 * decode an encoded basic auth
 * header to a credentials object
 */
export function decode (value) {
  /* remove the token prefix */
  const token = value.replace(/^(?:\s+)?basic\s+/i, '')

  /* decode creds from base64 */
  const [username, password] = Buffer
    .from(token, 'base64')
    .toString('utf-8')
    .split(':')

  return {
    username: String(username || ''),
    password: String(password || '')
  }
}

/**
 * returns a response early from the
 * lambda function by writing to res's
 * reference (hence the Object.assign)
 */
export function notAuthorized (res) {
  Object.assign(res, {
    status: '401',
    statusDescription: STATUS_CODES[401],
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
