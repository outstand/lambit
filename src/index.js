import { get } from 'object-path'
import { error } from './utils/logger'
import { findType } from './utils/trigger'
import www from './components/www'
import auth from './components/auth'
import cleanUrls from './components/clean-url'
import headers from './components/header'
import redirects from './components/redirect'
import rewrites from './components/rewrite'

module.exports = (opts = {}) => {
  // TODO: validate all options

  return async (evt, ctx, cb) => {
    try {
      const {
        request: req = {},
        response: res = {}
      } = get(evt, 'Records.0.cf', {})

      switch (findType(req, res)) {
        case 'viewer-request': {
          www(req, res, opts.www)
          auth(req, res, opts.auth || false)
          break
        }

        case 'origin-request': {
          cleanUrls(req, res, opts.cleanUrls || false)
          redirects(req, res, opts.redirects || [])
          rewrites(req, res, opts.rewrites || [])
          break
        }

        case 'origin-response': {
          /* nothing needed in this trigger yet */
          break
        }

        case 'viewer-response': {
          headers(req, res, opts.headers || [])
          break
        }
      }

      cb(null, res.status ? res : req)
    } catch (err) {
      error('Error:', err.message || err)
      cb(err)
    }
  }
}
