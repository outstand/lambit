import { expect } from 'chai'
import { originRequest } from './helpers'

describe('integration: redirects', () => {
  it('sends redirect response', async () => {
    const config = { redirects: [{ source: '/foo', to: '/bar' }] }
    const args = originRequest(config, '/foo')
    expect(args[1].status).to.equal('301')
    expect(args[1].headers.location[0].value).to.equal('/bar')
  })

  it('redirects with custom code', async () => {
    const config = { redirects: [{ source: '/foo', to: '/bar', code: 302 }] }
    const args = originRequest(config, '/foo')
    expect(args[1].status).to.equal('302')
    expect(args[1].headers.location[0].value).to.equal('/bar')
  })

  it('redirects with wildcard', async () => {
    const config = { redirects: [{ source: '/foo/*', to: '/foobar' }] }
    const args = originRequest(config, '/foo/bar')
    expect(args[1].status).to.equal('301')
    expect(args[1].headers.location[0].value).to.equal('/foobar')
  })

  it('redirects with segment', async () => {
    const config = { redirects: [{ source: '/foo/{name}/bar', to: '/{name}/baz' }] }
    const args = originRequest(config, '/foo/jane/bar')
    expect(args[1].status).to.equal('301')
    expect(args[1].headers.location[0].value).to.equal('/jane/baz')
  })

  it('redirects with crazy url', async () => {
    const config = { redirects: [{ source: '/foo*/{greet}-{name}!/*', to: '/{greet}/{name}' }] }
    const args = originRequest(config, '/foo/hey-jane!/bar/baz')
    expect(args[1].status).to.equal('301')
    expect(args[1].headers.location[0].value).to.equal('/hey/jane')
  })

  it('redirects with new hostname', async () => {
    const config = { redirects: [{ source: '/q/{query+}', to: 'https://google.com/?q={query}' }] }
    const args = originRequest(config, '/q/foobar')
    expect(args[1].status).to.equal('301')
    expect(args[1].headers.location[0].value).to.equal('https://google.com/?q=foobar')
  })

  it('does not append .html to result url', async () => {
    const config = {
      cleanUrls: true,
      redirects: [{ source: '/hi/{str}', to: '/hey/{str}' }]
    }
    const args = originRequest(config, '/hi/test')
    expect(args[1].status).to.equal('301')
    expect(args[1].headers.location[0].value).to.equal('/hey/test')
  })
})
