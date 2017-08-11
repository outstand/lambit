import { expect } from 'chai'
import * as trigger from './trigger'

describe('unit: trigger', () => {
  it('findType', async () => {
    const request = {
      headers: {
        'user-agent': [{ value: 'Amazon CloudFront' }],
        via: [{ value: '1.1 12345.cloudfront.net (CloudFront), 1.1  (CloudFront)' }]
      }
    }
    const response = {
      status: 200
    }
    expect(trigger.findType({})).to.equal('viewer-request')
    expect(trigger.findType({}, response)).to.equal('viewer-response')
    expect(trigger.findType(request)).to.equal('origin-request')
    expect(trigger.findType(request, response)).to.equal('origin-response')
  })
})
