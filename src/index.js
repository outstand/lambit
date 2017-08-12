import { get } from 'object-path'
import * as logger from './utils/logger'
import * as trigger from './utils/trigger'
// import * as segment from './utils/segment'
import auth from './components/auth'
import cleanUrl from './components/clean-url'
import header from './components/header'
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
      // TODO: validate all options

      opts.auth = opts.auth || false
      opts.cleanUrls = opts.cleanUrls || false
      opts.snippets = opts.snippets || []
      opts.headers = opts.headers || []
      opts.redirects = opts.redirects || []
      opts.rewrites = opts.rewrites || []

      switch (trigger.findType(req, res)) {
        case 'viewer-request': {
          opts.auth && auth(req, res, opts.auth)
          break
        }

        case 'origin-request': {
          opts.cleanUrls && cleanUrl(req, res)
          // redirects
          // rewrites
          break
        }

        case 'origin-response': {
          // snippets
          break
        }

        case 'viewer-response': {
          opts.headers.length && header(req, res, opts.headers)
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
