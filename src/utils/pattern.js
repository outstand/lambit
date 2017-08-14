import xregexp from 'xregexp'
import { get } from 'object-path'

const PATTERN_ESCAPE = /[-/\\^$*+?.()|[\]{}]/g
const PATTERN_SEGMENT = /\\{([a-zA-Z0-9_-]+)\\}/g
const PATTERN_WILDCARD_SINGLE = /\\\*/g
const PATTERN_WILDCARD_DOUBLE = /\\\*\\\*/g

export function escapeRegex (str = '') {
  return String(str)
    .replace(PATTERN_ESCAPE, '\\$&')
}

export function matches (pattern, url) {
  const regex = pattern instanceof RegExp
    ? pattern : toRegex(pattern)

  return regex.test(url)
}

export function toRegex (pattern) {
  if (/(\*)\1{2,}/g.test(pattern)) {
    throw new Error(`Wildcards can only be "*" or "**": ${pattern}`)
  }
  if (/\}\{/.test(pattern)) {
    throw new Error(`Cannot put two segments next to each other: ${pattern}`)
  }
  if (/\*\{|\}\*/.test(pattern)) {
    throw new Error(`Cannot put a segment and wildcard next to each other: ${pattern}`)
  }

  return xregexp(`^${pattern
    .split('/')
    .map((chunk) => escapeRegex(chunk)
      .replace(PATTERN_SEGMENT, '(?<$1>[^/\\s]+)')
      .replace(PATTERN_WILDCARD_DOUBLE, '([^\\s]*)')
      .replace(PATTERN_WILDCARD_SINGLE, '([^/\\s]*)'))
    .join('\\/')}$`)
}

export function extract (url, pattern) {
  const processed = pattern instanceof RegExp
    ? pattern : toRegex(pattern)

  const data = {}
  const wildcardData = []
  const matched = xregexp.exec(url, processed)
  const names = get(processed, 'xregexp.captureNames') || []

  if (!matched) {
    throw new Error(`${url} doesn't match pattern: ${pattern}`)
  }

  if (names.length) {
    names.forEach((name, indx) => {
      if (name) {
        if (!matched[name]) {
          throw new Error(`Could not find segment value: ${matched[name]}`)
        }

        data[name] = matched[name]
      } else {
        wildcardData.push(matched[indx + 1])
      }
    })
  } else {
    matched.slice(1)
      .forEach((i) => i && wildcardData.push(i))
  }

  wildcardData.forEach((val, indx) => {
    data[`$${indx + 1}`] = val
  })

  return data
}

export function render (uri, data = {}) {
  for (const i of Object.keys(data)) {
    const regex = new RegExp(`\\{?${escapeRegex(i)}\\}?`, 'g')
    uri = uri.replace(regex, data[i])
  }

  if (/\$[0-9]|\{.+\}/.test(uri)) {
    throw new Error(`Could not render all variables: ${uri}`)
  }

  return uri
}
