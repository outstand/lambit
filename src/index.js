module.exports = (opts = {}) => {
  return (event, context, callback) => {
    const { request } = event.Records[0].cf
    callback(null, request)
  }
}
