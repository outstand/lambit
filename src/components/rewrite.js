import { match, extract, render } from '../utils/pattern'

export default function (req, res, rewrites = []) {
  if (!Array.isArray(rewrites)) {
    throw new TypeError('"rewrites" must be an array')
  }

  /* go through each rewrite and look for a match */
  for (const data of rewrites) {
    /* make sure object structure is correct */
    if (!data.source || !data.to) {
      throw new Error(`Could not find "source" and "to" in rewrite: ${JSON.stringify(data)}`)
    }

    /* match url against pattern */
    if (match(data.source, req.uri)) {
      /* match found, use new uri for origin lookup */
      req.uri = render(data.to, extract(req.uri, data.source))

      /* quit looking for more matches */
      return
    }
  }
}
