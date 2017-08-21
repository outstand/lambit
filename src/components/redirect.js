import { STATUS_CODES } from 'http'
import pattern, { findMatch } from '../utils/pattern'

export default function (req, res, redirects = []) {
  if (!Array.isArray(redirects)) {
    throw new TypeError('"redirects" must be an array')
  }

  /* strip out each source pattern */
  const sources = redirects.map(i => i.source)
  /* go through each redirect and look for a match */
  const match = findMatch(sources, req.uri)

  if (match) {
    /* match found, convert to new pattern and redirect */
    const data = redirects[match.index]
    const rendered = pattern(data.source, data.to, req.uri)

    Object.assign(res, redirect(rendered, data.code))
  }
}

/**
 * generates a lambda response object
 * specific to a CloudFront redirect
 */
export function redirect (to, code = 301) {
  /* make sure the status code is an int */
  const status = parseInt(code, 10)

  /* make sure status is a valid redirect code */
  if (status < 300 || status > 308) {
    throw new Error(`${status} is not a valid redirect status code`)
  }

  return {
    status: String(status), /* CF expects status as a string */
    statusDescription: STATUS_CODES[status],
    body: `Redirecting to ${to}`,
    headers: {
      'content-type': [{
        key: 'Content-Type',
        value: 'text/plain; charset=UTF-8'
      }],
      location: [{
        key: 'Location',
        value: to
      }]
    }
  }
}
