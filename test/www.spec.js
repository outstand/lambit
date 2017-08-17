import { expect } from 'chai'
import { viewerRequest } from './helpers'

describe('integration: www', () => {
  it('no redirect (with www)', async () => {
    const headers = { host: [{ key: 'Host', value: 'www.awesome.com' }] }
    const args = viewerRequest({}, '/hi', { headers })
    expect(args[1].uri).to.equal('/hi')
  })

  it('no redirect (without www)', async () => {
    const headers = { host: [{ key: 'Host', value: 'awesome.com' }] }
    const args = viewerRequest({}, '/hi', { headers })
    expect(args[1].uri).to.equal('/hi')
  })

  it('redirects to www', async () => {
    const config = { www: true }
    const headers = { host: [{ key: 'Host', value: 'awesome.com' }] }
    const args = viewerRequest(config, '/hi', { headers })
    expect(args[1].status).to.equal('301')
    expect(args[1].headers.location[0].value).to.equal('www.awesome.com/hi')
  })

  it('redirects to no www', async () => {
    const config = { www: false }
    const headers = { host: [{ key: 'Host', value: 'www.awesome.com' }] }
    const args = viewerRequest(config, '/hi', { headers })
    expect(args[1].status).to.equal('301')
    expect(args[1].headers.location[0].value).to.equal('awesome.com/hi')
  })
})
