import { STATUS_CODES } from 'http'
import { match, extract, render } from '../utils/pattern'

export default function (req, res, redirects = []) {
  if (!Array.isArray(redirects)) {
    throw new TypeError('"redirects" must be an array')
  }

  /* go through each redirect and look for a match */
  for (const data of redirects) {
    /* make sure object structure is correct */
    if (!data.source || !data.to) {
      throw new TypeError(`Could not find "source" and "to" in redirect: ${JSON.stringify(data)}`)
    }

    /* match url against pattern */
    if (match(data.source, req.uri)) {
      /* match found, convert to new pattern */
      const newUrl = render(data.to, extract(req.uri, data.source))

      /* send early-response redirect */
      Object.assign(res, redirect(newUrl, data.code))

      /* quit looking for more matches */
      return
    }
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
