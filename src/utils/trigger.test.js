import { expect } from 'chai'
import * as trigger from './trigger'

describe('unit: trigger', () => {
  it('default', async () => {
    const cfRequest = {
      headers: {
        'user-agent': [{ value: 'Amazon CloudFront' }],
        via: [{ value: '1.1 12345.cloudfront.net (CloudFront), 1.1  (CloudFront)' }]
      }
    }
    const cfResponse = {
      status: 200
    }
    expect(trigger.default({})).to.equal('viewer-request')
    expect(trigger.default({}, cfResponse)).to.equal('viewer-response')
    expect(trigger.default(cfRequest)).to.equal('origin-request')
    expect(trigger.default(cfRequest, cfResponse)).to.equal('origin-response')
  })
})
