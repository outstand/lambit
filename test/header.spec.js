import { expect } from 'chai'
import { viewerResponse } from './helpers'

describe('integration: headers', () => {
  const config = {
    headers: [
      { name: 'Whatup', value: 'yoyo' },
      { name: 'Testing', value: 'Hello', source: '/admin**' }
    ]
  }

  it('adds custom headers', async () => {
    const args = viewerResponse(config, '/')
    expect(args[1].headers.whatup[0].key).to.equal('Whatup')
    expect(args[1].headers.whatup[0].value).to.equal('yoyo')
    expect(args[1].headers.testing).to.equal(undefined)
  })

  it('stops invalid header name', async () => {
    const config = { headers: [{ name: 'yo@yo', value: 'hi' }] }
    const args = viewerResponse(config, '/')
    expect(args[0]).to.be.instanceof(Error)
  })

  it('adds custom headers with source', async () => {
    const args = viewerResponse(config, '/admin')
    expect(args[1].headers.whatup[0].value).to.equal('yoyo')
    expect(args[1].headers.testing[0].value).to.equal('Hello')
  })
})
