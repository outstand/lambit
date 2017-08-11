import sinon from 'sinon'
import lambchop from '../src'

export function run (config, request, response) {
  const spy = sinon.spy()
  const evt = { Records: [{ cf: { request, response } }] }

  lambchop(config)(evt, null, spy)

  const args = spy.args[0]
  return { spy, args }
}

export const headers = {
  via: [{ value: '1.1 123.cloudfront.net' }],
  'user-agent': [{ value: 'Amazon CloudFront' }]
}
