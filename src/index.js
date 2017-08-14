import { get } from 'object-path'
import * as logger from './utils/logger'
import * as trigger from './utils/trigger'
import www from './components/www'
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
      // TODO: a/b testing
      // TODO: validate all options

      switch (trigger.findType(req, res)) {
        case 'viewer-request': {
          www(req, res, opts.www)
          auth(req, res, opts.auth || false)
          break
        }

        case 'origin-request': {
          cleanUrls(req, res, opts.cleanUrls || false)
          redirects(req, res, opts.redirects || [])
          // rewrites
          break
        }

        case 'origin-response': {
          // snippets
          break
        }

        case 'viewer-response': {
          headers(req, res, opts.headers || [])
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
