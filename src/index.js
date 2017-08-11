import { get } from 'object-path'
import * as logger from './utils/logger'
import * as trigger from './utils/trigger'
// import * as segment from './utils/segment'
import cleanUrl from './components/clean-url'
// import redirect from './components/redirect'

module.exports = (opts = {}) => {
  return async (evt, ctx, cb) => {
    try {
      const {
        request: req = {},
        response: res = {}
      } = get(evt, 'Records.0.cf', {})

      // TODO: headers route match
      // TODO: wildcards
      // TODO: segment query params
      // TODO: redirects with host (for www)
      // TODO: a/b testing

      opts.cleanUrls = opts.cleanUrls || false
      opts.auth = opts.auth || false
      opts.snippets = opts.snippets || []
      opts.headers = opts.headers || []
      opts.redirects = opts.redirects || []
      opts.rewrites = opts.rewrites || []

      switch (trigger.findType(req, res)) {
        case 'viewer-request': {
          // auth
          break
        }

        case 'origin-request': {
          opts.cleanUrls && cleanUrl(req, res)
          // redirects
          // rewrites
          break
        }

        case 'origin-response': {
          // headers
          // snippets
          break
        }

        case 'viewer-response': {
          break
        }
      }

      cb(null, res.status ? res : req)
    } catch (err) {
      logger.error('Error:', err.message || err)
      cb(err)
    }
  }
}

// function parseHeaders (res, opts) {
//   if (!Array.isArray(opts.headers)) {
//     throw new TypeError(`"headers" should be an array, got ${typeof opts.headers}`)
//   }
//
//   res.headers = res.headers || []
//
//   for (const data of opts.headers) {
//     res.headers[data.name.toLowerCase()] = [{
//       key: data.name,
//       value: typeof data.value === 'function'
//         ? data.value() : data.value
//     }]
//   }
// }

// function parseRedirects (req, opts) {
//   if (!Array.isArray(opts.redirects)) {
//     throw new TypeError(`"redirects" should be an array, got ${typeof opts.redirects}`)
//   }
//
//   for (const data of opts.redirects) {
//     if (segment.toRegex(data.from).test(req.uri)) {
//       return redirect(
//         segment.render(data.from, data.to, req.uri),
//         data.code
//       )
//     }
//   }
// }
