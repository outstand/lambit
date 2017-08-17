import { expect } from 'chai'
import { originRequest } from './helpers'

describe('integration: rewrites', () => {
  const config = {
    rewrites: [
      { source: '/hi', to: '/hey' },
      { source: '/greet/{name}/hello', to: '/{name}/hello' },
      { source: '/hello', to: '/whatup', code: 302 },
      { source: '/yo/**', to: '/wazzup/$1' },
      { source: '/he*/{greeting}-{name}!/**', to: '/$2/{name}' }
    ]
  }

  it('rewrites url', async () => {
    const args = originRequest(config, '/hi')
    expect(args[1].uri).to.equal('/hey')
  })

  it('rewrites url for pushstate', async () => {
    const config = { rewrites: [{ source: '/**', to: '/index.html' }] }
    const args = originRequest(config, '/hello')
    expect(args[1].uri).to.equal('/index.html')
  })

  it('rewrites with wildcard', async () => {
    const args = originRequest(config, '/yo/yo')
    expect(args[1].uri).to.equal('/wazzup/yo')
  })

  it('rewrites with segment', async () => {
    const args = originRequest(config, '/greet/jane/hello')
    expect(args[1].uri).to.equal('/jane/hello')
  })

  it('rewrites with crazy url', async () => {
    const args = originRequest(config, '/hello/hey-jane!/whatup')
    expect(args[1].uri).to.equal('/whatup/jane')
  })

  it('stops bad pattern', async () => {
    const config = { rewrites: [{ source: '/bad/{greeting}{name}', to: '/{name}' }] }
    const args = originRequest(config, '/bad/hi')
    expect(args[0]).to.be.instanceof(Error)
  })

  it('prevents double segment', async () => {
    const config = { rewrites: [{ source: '/hi/{name}/{name}', to: '/hey/{name}' }] }
    const args = originRequest(config, '/hi/jane/jane')
    expect(args[0]).to.be.instanceof(Error)
  })

  it('prevents bad rewrite object', async () => {
    const config = { rewrites: [{ from: '/hi', to: '/hey' }] }
    const args = originRequest(config, '/hi')
    expect(args[0]).to.be.instanceof(Error)
  })

  it('prevents non-existant segment', async () => {
    const config = { rewrites: [{ source: '/hi', to: '/hey/{name}' }] }
    const args = originRequest(config, '/hi')
    expect(args[0]).to.be.instanceof(Error)
  })

  it('errors with no leading slash on source', async () => {
    const config = { rewrites: [{ source: 'test', to: '/hi' }] }
    const args = originRequest(config, '/test')
    expect(args[0]).to.be.instanceof(Error)
  })
})
