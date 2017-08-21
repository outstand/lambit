import { expect } from 'chai'
import { originRequest } from './helpers'

describe('integration: rewrites', () => {
  it('rewrites url', async () => {
    const config = { rewrites: [{ source: '/foo', to: '/bar' }] }
    const args = originRequest(config, '/foo')
    expect(args[1].uri).to.equal('/bar')
  })

  it('rewrites url for pushstate', async () => {
    const config = { rewrites: [{ source: '/*', to: '/index.html' }] }
    const args = originRequest(config, '/foo/bar')
    expect(args[1].uri).to.equal('/index.html')
  })

  it('rewrites with wildcard', async () => {
    const config = { rewrites: [{ source: '/bar/*', to: '/baz' }] }
    const args = originRequest(config, '/bar/baz')
    expect(args[1].uri).to.equal('/baz')
  })

  it('rewrites with segment', async () => {
    const config = { rewrites: [{ source: '/foo/{name}/bar', to: '/{name}/baz' }] }
    const args = originRequest(config, '/foo/jane/bar')
    expect(args[1].uri).to.equal('/jane/baz')
  })

  it('rewrites with wildcard segment', async () => {
    const config = { rewrites: [{ source: '/foo/{name+}', to: '/{name}/baz' }] }
    const args = originRequest(config, '/foo/jane/doe/bar/baz')
    expect(args[1].uri).to.equal('/jane/doe/bar/baz/baz')
  })

  it('rewrites with optional segment', async () => {
    const config = { rewrites: [{ source: '/foo/{name?}', to: '/bar/{name}' }] }
    const args = originRequest(config, '/foo/')
    expect(args[1].uri).to.equal('/bar/')
  })

  it('rewrites with crazy url', async () => {
    const config = { rewrites: [{ source: '/he*/{greet}-{name+}!/*', to: '/{greet}/{name}' }] }
    const args = originRequest(config, '/hello/hey-jane-doe!/foo')
    expect(args[1].uri).to.equal('/hey/jane-doe')
  })

  it('non-existant segment', async () => {
    const config = { rewrites: [{ source: '/foo', to: '/bar/{name}' }] }
    const args = originRequest(config, '/foo')
    expect(args[1].uri).to.equal('/bar/')
  })

  it('stops bad pattern', async () => {
    const config = { rewrites: [{ source: '/bad/{foo}{bar}', to: '/{bar}' }] }
    const args = originRequest(config, '/bad/foobar')
    expect(args[0]).to.be.instanceof(Error)
  })

  it('prevents double segment', async () => {
    const config = { rewrites: [{ source: '/{name}/{name}', to: '/foo/{name}' }] }
    const args = originRequest(config, '/jane/doe')
    expect(args[0]).to.be.instanceof(Error)
  })

  it('ignores bad rewrite object', async () => {
    const config = { rewrites: [{ from: '/foo', to: '/bar' }] }
    const args = originRequest(config, '/foo')
    expect(args[1].uri).to.equal('/foo')
  })

  it.skip('errors with no leading slash on source', async () => {
    const config = { redirects: [{ source: 'test', to: '/hi' }] }
    const args = originRequest(config, '/test')
    expect(args[0]).to.be.instanceof(Error)
  })
})
