import path from 'path'
import { findMatch } from '../utils/pattern'
import { redirect } from './redirect'

const PATTERN_HTML = /\.html?$/i
const PATTERN_INDEX = /index(?:\.html?)?$/i

export default function (req, res, clean) {
  if (!clean) {
    return
  }

  if (typeof clean !== 'boolean' && !Array.isArray(clean)) {
    throw new TypeError('"cleanUrls" must be a boolean or an array')
  }

  /* if we have sources, make sure one of them matches url */
  if (Array.isArray(clean)) {
    /* check if the uri is a match for one of the patterns */
    const match = findMatch(clean, req.uri)

    /* no match was found, abort cleanup */
    if (!match) {
      return
    }
  }

  /* if url is dirty, clean it and redirect */
  if (isDirty(req.uri)) {
    const cleanUrl = cleanup(req.uri)
    Object.assign(res, redirect(cleanUrl))

    return
  }

  /* if using clean urls, add extension for origin lookups */
  req.uri = addExtension(req.uri)
}

/**
 * determines whether a url needs
 * to be redirected to a "cleaned up"
 * version or not
 */
export function isDirty (uri) {
  return PATTERN_HTML.test(uri) ||
    PATTERN_INDEX.test(uri)
}

/**
 * cleans up a dirty url by removing
 * html extensions and index files
 */
export function cleanup (uri) {
  return uri
    .replace(PATTERN_HTML, '')
    .replace(PATTERN_INDEX, '')
}

/**
 * adds an html extension for origin
 * lookups on routes that were cleaned
 * up and don't have an extension
 */
export function addExtension (uri) {
  const needsExtension =
    uri.slice(-1) !== '/' &&
    !path.extname(uri)

  return needsExtension ? `${uri}.html` : uri
}
