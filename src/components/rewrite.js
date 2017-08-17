import { matches, extract, render } from '../utils/pattern'

export default function (req, res, rewrites) {
  for (const data of rewrites) {
    if (!data.source || !data.to) {
      throw new Error(`Could not find "source" and "to" in rewrite: ${JSON.stringify(data)}`)
    }

    if (!/^\//.test(data.to)) {
      throw new Error(`Destination must start with a slash: ${data.to}`)
    }

    if (matches(data.source, req.uri)) {
      req.uri = render(data.to, extract(req.uri, data.source))
      return
    }
  }
}
