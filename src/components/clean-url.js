import path from 'path'
import redirect from './redirect'

const PATTERN_HTML = /\.html?$/i
const PATTERN_INDEX = /index(?:\.html?)?$/i

export default function (req, res) {
  if (isDirty(req.uri)) {
    const cleanUrl = cleanup(req.uri)
    Object.assign(res, redirect(cleanUrl))
  }

  req.uri = addExtension(req.uri)
}

export function isDirty (uri) {
  return PATTERN_HTML.test(uri) ||
    PATTERN_INDEX.test(uri)
}

export function cleanup (uri) {
  return uri
    .replace(PATTERN_HTML, '')
    .replace(PATTERN_INDEX, '')
}

export function addExtension (uri) {
  return !path.extname(uri) && uri.slice(-1) !== '/'
    ? `${uri}.html`
    : uri
}
