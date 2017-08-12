const PATTERN_ESCAPE = /[-/\\^$*+?.()|[\]{}]/g
const PATTERN_SEGMENT = /\\{([^/\s]+)\\}/g
const PATTERN_WILDCARD_DOUBLE = /\\\*\\\*/g
const PATTERN_WILDCARD_SINGLE = /\\\*/g

export function escapeRegex (str = '') {
  return String(str)
    .replace(PATTERN_ESCAPE, '\\$&')
}

export function toRegex (uri) {
  const newUri = escapeRegex(uri)
    .split('\\/')
    .map((chunk) => chunk
      .replace(PATTERN_SEGMENT, '[^/\\s]+')
      .replace(PATTERN_WILDCARD_DOUBLE, '[^\\s]*')
      .replace(PATTERN_WILDCARD_SINGLE, '[^/\\s]*'))
    .join('\\/')

  return new RegExp(`^${newUri}$`)
}

export function matches (pattern, url) {
  const regex = pattern instanceof RegExp
    ? pattern : toRegex(pattern)

  return regex.test(url)
}

// export function parse (pattern) {
//   const indexes = {}
//
//   pattern.split('/').forEach((chunk, indx) => {
//     const matched = chunk.match(PATTERN_SEGMENT)
//
//     if (matched) {
//       if (matched[1] === 'wildcard') {
//         throw new Error('Cannot use reserved placeholder name "wildcard"')
//       }
//
//       indexes[indx] = matched[1]
//     }
//   })
//
//   return indexes
// }
//
// export function render (pattern1, pattern2, uri) {
//   const segments = {}
//   const indexes = parse(pattern1)
//
//   uri.split('/').forEach((chunk, indx) => {
//     const name = indexes[indx]
//     if (!name) return
//     // if (!name) {
//     //   throw new Error(`Could not find placeholder "${chunk}"`)
//     // }
//
//     if (segments[name]) {
//       throw new Error(`":${name}" is used twice in "${pattern1}"`)
//     }
//
//     segments[name] = chunk
//   })
//
//   Object.keys(segments).forEach((key) => {
//     pattern2 = pattern2.replace(`/:${key}`, `/${segments[key]}`)
//   })
//
//   return pattern2
// }
