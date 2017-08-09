import redirect from './redirect'

module.exports = (opts = {}) => {
  return async (event, context, callback) => {
    try {
      const { request } = event.Records[0].cf

      opts.redirects = opts.redirects || []

      const redirect = parseRedirects(request, opts)
      if (redirect) return callback(null, redirect)

      callback(null, request)
    } catch (err) {
      console.error('Error:', err.message || err)
      callback(err)
    }
  }
}

function parseRedirects (req, opts) {
  const redirects = Array.isArray(opts.redirects)
    ? opts.redirects
    : Object.keys(opts.redirects)
      .map((i) => ({ from: i, to: opts.redirects[i] }))

  for (const data of redirects) {
    if (req.uri === data.from) {
      return redirect(data.to, data.code)
    }
  }
}
