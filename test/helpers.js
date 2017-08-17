import sinon from 'sinon'
import lambchop from '../src'

/**
 * headers that simulate a cloudfront origin request
 */
export const headers = {
  via: [{ value: '1.1 123.cloudfront.net' }],
  'user-agent': [{ value: 'Amazon CloudFront' }]
}

/**
 * helper function that runs a simulated lambda@edge
 * function as it would run in AWS
 */
export function run (config, request, response) {
  const cb = sinon.spy()

  const evt = { Records: [{ cf: { request, response } }] }
  const ctx = {}

  lambchop(config)(evt, ctx, cb)

  return cb.args[0]
}
