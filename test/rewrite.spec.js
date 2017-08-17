import { expect } from 'chai'
import { run, headers } from './helpers'

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
    const args = run(config, { uri: '/hi', headers })
    expect(args[1].uri).to.equal('/hey')
  })

  it('rewrites url for pushstate', async () => {
    const args = run({
      rewrites: [{ source: '/**', to: '/index.html' }]
    }, { uri: '/hello', headers })
    expect(args[1].uri).to.equal('/index.html')
  })

  it('rewrites with wildcard', async () => {
    const args = run(config, { uri: '/yo/yo', headers })
    expect(args[1].uri).to.equal('/wazzup/yo')
  })

  it.skip('stops rewrite without slash', async () => {
    const args = run({
      rewrites: [{ source: '/**', to: 'hi' }]
    }, { uri: '/', headers })
    expect(args[0]).to.be.instanceof(Error)
  })

  it('rewrites with segment', async () => {
    const args = run(config, { uri: '/greet/jane/hello', headers })
    expect(args[1].uri).to.equal('/jane/hello')
  })

  it('rewrites with crazy url', async () => {
    const args = run(config, { uri: '/hello/hey-jane!/whatup', headers })
    expect(args[1].uri).to.equal('/whatup/jane')
  })

  it('stops bad pattern', async () => {
    const args = run({
      rewrites: [{ source: '/bad/{greeting}{name}', to: '/{name}' }]
    }, { uri: '/bad/hi', headers })
    expect(args[0]).to.be.instanceof(Error)
  })

  it('prevents double segment', async () => {
    const args = run({
      rewrites: [{ source: '/hi/{name}/{name}', to: '/hey/{name}' }]
    }, { uri: '/hi/jane/jane', headers })
    expect(args[0]).to.be.instanceof(Error)
  })

  it('prevents bad rewrite object', async () => {
    const args = run({
      rewrites: [{ from: '/hi', to: '/hey' }]
    }, { uri: '/hi', headers })
    expect(args[0]).to.be.instanceof(Error)
  })

  it('prevents non-existant segment', async () => {
    const args = run({
      rewrites: [{ source: '/hi', to: '/hey/{name}' }]
    }, { uri: '/hi', headers })
    expect(args[0]).to.be.instanceof(Error)
  })
})
