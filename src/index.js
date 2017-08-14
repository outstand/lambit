import { get } from 'object-path'
import * as logger from './utils/logger'
import * as trigger from './utils/trigger'
import auth from './components/auth'
import cleanUrls from './components/clean-url'
import headers from './components/header'
import redirects from './components/redirect'

module.exports = (opts = {}) => {
  return async (evt, ctx, cb) => {
    try {
      const {
        request: req = {},
        response: res = {}
      } = get(evt, 'Records.0.cf', {})

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
          auth(req, res, opts.auth)
          break
        }

        case 'origin-request': {
          cleanUrls(req, res, opts.cleanUrls)
          redirects(req, res, opts.redirects)
          // rewrites
          break
        }

        case 'origin-response': {
          // snippets
          break
        }

        case 'viewer-response': {
          headers(req, res, opts.headers)
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
