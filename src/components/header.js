import { match } from '../utils/pattern'

export default function (req, res, headers = []) {
  /* in case there aren't any existing headers */
  res.headers = res.headers || []

  if (!Array.isArray(headers)) {
    throw new TypeError('"headers" must be an array')
  }

  /* set our server header (it can be overwritten) */
  res.headers.server = [{
    key: 'Server',
    value: 'Lambchop'
  }]

  /* analyze each custom response header */
  for (const data of headers) {
    /* make sure object structure is correct */
    if (!data.name || !data.value) {
      throw new TypeError(`Could not find "name" and "value" in header: ${JSON.stringify(data)}`)
    }

    /* skip if route doesn't match (if there's a source) */
    if (data.source && !match(data.source, req.uri)) {
      continue
    }

    /* make sure header field doesn't have invalid chars */
    if (!isValidName(data.name)) {
      throw new Error(`"${data.name}" is an invalid header name`)
    }

    /* attach custom header to the response, key must be lowercase */
    /* http://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-event-structure.html */
    res.headers[data.name.toLowerCase()] = [{
      key: data.name,
      value: data.value
    }]
  }
}

/**
 * header names must not contain
 * certain characters or things
 * will blow up
 *
 * https://tools.ietf.org/html/rfc7230#section-3.2.6
 */
export function isValidName (name) {
  return /^[a-zA-Z0-9!#$%&'*+-.^_`|~]+$/.test(name)
}
