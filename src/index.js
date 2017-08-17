import { get } from 'object-path'
import { error } from './utils/logger'
import trigger from './utils/trigger'
import www from './components/www'
import auth from './components/auth'
import redirects from './components/redirect'
import rewrites from './components/rewrite'
import cleanUrls from './components/clean-url'
import headers from './components/header'

module.exports = (opts = {}) => {
  // TODO: slashify all patterns and destinations

  return (evt, ctx, cb) => {
    try {
      /* get the data passed in by cloudfront */
      const {
        request: req = {},
        response: res = {}
      } = get(evt, 'Records.0.cf', {})

      /* find the cloudfront event type, */
      /* since different actions take place in each one */
      switch (trigger(req, res)) {
        case 'viewer-request': {
          www(req, res, opts.www)
          auth(req, res, opts.auth)

          break
        }

        case 'origin-request': {
          redirects(req, res, opts.redirects)
          rewrites(req, res, opts.rewrites)

          /**
           * this should stay last in line so
           * ".html" doesn't get appended to
           * the redirect/rewrite rules
           */
          cleanUrls(req, res, opts.cleanUrls)

          break
        }

        case 'origin-response': {
          /* nothing needed in this trigger yet */

          break
        }

        case 'viewer-response': {
          headers(req, res, opts.headers)

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
