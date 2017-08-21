// TODO: deal with leading and trailing slashes

export default function (srcPattern, dstPattern, uri) {
  return render(
    parse(dstPattern),
    extract(parse(srcPattern), uri)
  )
}

export function getRegex (pattern) {
  return pattern instanceof RegExp
    ? pattern : pattern.regex || parse(pattern).regex
}

export function escape (str = '') {
  /**
   * NOTE: intentially not escaping "-", since it
   * results in linting errors when it's escaped and
   * not in a character class "[-]". since character
   * classes are escaped, we can get away with not
   * escaping dashes.
   */

  return String(str)
    .replace(/[/\\^$*+?.()|[\]{}]/g, '\\$&')
}

export function match (parsed, uri) {
  const regex = getRegex(parsed)

  if (!(regex instanceof RegExp)) {
    throw new Error(`Not a valid regex: ${parsed}`)
  }

  return regex.test(uri)
}

export function findMatch (patterns, uri) {
  let result

  if (!Array.isArray(patterns)) {
    throw new TypeError(`Expected an array of patterns: ${patterns}`)
  }

  for (const i in patterns.filter(Boolean)) {
    const pattern = patterns[i]

    if (match(pattern, uri)) {
      result = {
        matched: true,
        index: parseInt(i, 10)
      }

      break
    }
  }

  return result
}

export function parse (path) {
  if (typeof path !== 'string') {
    throw new TypeError('Pattern must be a string')
  }
  if (/\}\{/.test(path)) {
    throw new Error(`Cannot put two segments next to each other: ${path}`)
  }
  if (/\*\{|\}\*/.test(path)) {
    throw new Error(`Cannot put a segment and wildcard next to each other: ${path}`)
  }

  const patterns = {
    segment: '([^/\\s]+?)',
    wildcard: '[^\\s]*',
    suffixes: {
      '+': '([^\\s]+?)',
      '?': '([^/\\s]+?)?'
    }
  }

  const segmentNames = []
  const segmentRegex = /\\{([^}]+?)?\\}/g

  let match
  let escaped = escape(path)

  while ((match = segmentRegex.exec(escaped)) !== null) {
    if (!match[1]) {
      throw new Error(`Segment must have a name: ${path}`)
    }

    const name = match[1]
    const lastChar = name.charAt(name.length - 1)
    const segment = patterns.suffixes[lastChar] || patterns.segment

    const parsedName = name.replace(
      new RegExp(`(.*)${Object.keys(patterns.suffixes)
        /* need 3 escapes for each symbol,
          and escapes for each escape... */
        .map(s => `\\\\\\${s}`)
        .join('|')}$`),
      '$1'
    )

    if (!/^[\w]+$/.test(parsedName)) {
      throw new Error(`Segments can only contain numbers, letters and underscores: ${path}`)
    }
    if (segmentNames.indexOf(parsedName) > -1) {
      throw new Error(`Duplicate segment found in: ${path}`)
    }

    segmentNames.push(parsedName)
    escaped = (
      escaped.substring(0, match.index) + segment +
      escaped.substring(match.index + name.length + 4)
    )

    /* since we are putting new content in the matched string,
      we need to adjust position according to the content we added */
    segmentRegex.lastIndex = match.index + segment.length
  }

  /* add in wildcard patterns */
  escaped = escaped
    .replace(/\\\*/g, patterns.wildcard)

  return {
    pattern: path,
    keys: segmentNames,
    regex: new RegExp(`^${escaped}$`, 'i')
  }
}

export function extract (parsed, path) {
  const data = {}

  const regex = getRegex(parsed)
  const matched = path.match(regex)

  if (!matched) {
    throw new Error('Path does not match the pattern')
  }

  matched.slice(1).forEach((val, idx) => {
    const key = parsed.keys
      /* dealing with a regex we parsed ourselves, use segment names */
      ? parsed.keys[idx]
      /* dealing with a user passed regex, use numeric key */
      : idx + 1

    data[key] = val || ''
  })

  return data
}

export function render (parsed, data = {}) {
  let rendered = parsed.pattern

  if (!rendered) {
    throw new TypeError('Expecting a parsed pattern')
  }
  if (/\*/.test(rendered)) {
    throw new Error(`Cannot render wildcards in: ${rendered}`)
  }

  for (const key of parsed.keys) {
    rendered = rendered.replace(
      new RegExp(`\\{${key}[\\W]?\\}`, 'g'),
      data[key] || ''
    )
  }

  return rendered
}
