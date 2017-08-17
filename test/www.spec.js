import { expect } from 'chai'
import { run } from './helpers'

describe('integration: www', () => {
  it('no redirect (with www)', async () => {
    const headers = { host: [{ key: 'Host', value: 'www.awesome.com' }] }
    const args = run({}, { uri: '/hi', headers })
    expect(args[1].uri).to.equal('/hi')
  })

  it('no redirect (without www)', async () => {
    const headers = { host: [{ key: 'Host', value: 'awesome.com' }] }
    const args = run({}, { uri: '/hi', headers })
    expect(args[1].uri).to.equal('/hi')
  })

  it('redirects to www', async () => {
    const headers = { host: [{ key: 'Host', value: 'awesome.com' }] }
    const args = run({ www: true }, { uri: '/hi', headers })
    expect(args[1].status).to.equal('301')
    expect(args[1].headers.location[0].value).to.equal('www.awesome.com/hi')
  })

  it('redirects to no www', async () => {
    const headers = { host: [{ key: 'Host', value: 'www.awesome.com' }] }
    const args = run({ www: false }, { uri: '/hi', headers })
    expect(args[1].status).to.equal('301')
    expect(args[1].headers.location[0].value).to.equal('awesome.com/hi')
  })
})
