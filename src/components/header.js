import { matches } from '../utils/pattern'

export default function (req, res, headers = []) {
  res.headers = res.headers || []

  for (const data of headers) {
    if (data.source && !matches(data.source, req.uri)) {
      continue
    }

    if (!isValidName(data.name)) {
      throw new Error(`"${data.name}" is an invalid header name`)
    }

    res.headers[data.name.toLowerCase()] = [{
      key: data.name,
      value: data.value
    }]
  }
}

export function isValidName (name) {
  return /^[a-zA-Z0-9!#$%&'*+-.^_`|~]+$/.test(name)
}
