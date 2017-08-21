import pattern, { findMatch } from '../utils/pattern'

export default function (req, res, rewrites = []) {
  if (!Array.isArray(rewrites)) {
    throw new TypeError('"rewrites" must be an array')
  }

  /* strip out each source pattern */
  const sources = rewrites.map(i => i.source)
  /* go through each rewrite and look for a match */
  const match = findMatch(sources, req.uri)

  if (match) {
    /* match found, render and use new uri for origin lookup */
    const data = rewrites[match.index]
    req.uri = pattern(data.source, data.to, req.uri)
  }
}
