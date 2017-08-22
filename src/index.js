import { get } from './utils/deep'
import trigger from './utils/trigger'
import www from './components/www'
import protect from './components/protect'
import redirects from './components/redirect'
import rewrites from './components/rewrite'
import cleanUrls from './components/clean-url'
import headers from './components/header'

module.exports = (opts = {}) => (evt, ctx, cb) => {
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
        protect(req, res, opts.protect)

        break
      }

      case 'origin-request': {
        redirects(req, res, opts.redirects)
        rewrites(req, res, opts.rewrites)

        /* should always be last in line, */
        /* so ".html" doesn't get appended to other rules */
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

    /* send response if set, otherwise continue with request */
    cb(null, res.status ? res : req)
  } catch (err) {
    process.env.NODE_ENV !== 'testing' &&
      console.error('Error:', err.message || err)

    cb(err)
  }
}
