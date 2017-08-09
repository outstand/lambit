import { STATUS_CODES } from 'http'

export default function (to, code = 301) {
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
      contentType: [{
        key: 'Content-Type',
        value: 'text/plain; charset=UTF-8'
      }]
    }
  }
}
