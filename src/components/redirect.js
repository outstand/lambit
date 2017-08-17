import { STATUS_CODES } from 'http'
import { matches, extract, render } from '../utils/pattern'

export default function (req, res, redirects) {
  for (const data of redirects) {
    if (!data.source || !data.to) {
      throw new Error(`Could not find "source" and "to" in redirect: ${JSON.stringify(data)}`)
    }

    if (matches(data.source, req.uri)) {
      const newUrl = render(data.to, extract(req.uri, data.source))
      Object.assign(res, redirect(newUrl, data.code))

      return
    }
  }
}

export function redirect (to, code = 301) {
  const status = parseInt(code, 10)

  if (status < 300 || status > 308) {
    throw new Error(`${status} is not a valid redirect status code`)
  }

  return {
    status: String(status),
    statusDescription: STATUS_CODES[status],
    body: `Redirecting to ${to}`,
    headers: {
      location: [{
        key: 'Location',
        value: to
      }],
      'content-type': [{
        key: 'Content-Type',
        value: 'text/plain; charset=UTF-8'
      }]
    }
  }
}
