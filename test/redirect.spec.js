import { expect } from 'chai'
import { originRequest } from './helpers'

describe('integration: redirects', () => {
  const config = {
    redirects: [
      { source: '/hi', to: '/hey' },
      { source: '/greet/{name}/hello', to: '/{name}/hello' },
      { source: '/hello', to: '/whatup', code: 302 },
      { source: '/yo/**', to: '/wazzup/$1' },
      { source: '/he*/{greeting}-{name}!/**', to: '/$2/{name}' },
      { source: '/{query}/**', to: 'https://google.com/$1/?q={query}' }
    ]
  }

  it('sends redirect response', async () => {
    const args = originRequest(config, '/hi')
    expect(args[1].status).to.equal('301')
    expect(args[1].headers.location[0].value).to.equal('/hey')
  })

  it('redirects with custom code', async () => {
    const args = originRequest(config, '/hello')
    expect(args[1].status).to.equal('302')
    expect(args[1].headers.location[0].value).to.equal('/whatup')
  })

  it('redirects with a hostname', async () => {
    const args = originRequest(config, '/yoyo/search')
    expect(args[1].status).to.equal('301')
    expect(args[1].headers.location[0].value).to.equal('https://google.com/search/?q=yoyo')
  })

  it('redirects with wildcard', async () => {
    const args = originRequest(config, '/yo/yo')
    expect(args[1].status).to.equal('301')
    expect(args[1].headers.location[0].value).to.equal('/wazzup/yo')
  })

  it('redirects with segment', async () => {
    const args = originRequest(config, '/greet/jane/hello')
    expect(args[1].status).to.equal('301')
    expect(args[1].headers.location[0].value).to.equal('/jane/hello')
  })

  it('redirects with crazy url', async () => {
    const args = originRequest(config, '/hello/hey-jane!/whatup')
    expect(args[1].status).to.equal('301')
    expect(args[1].headers.location[0].value).to.equal('/whatup/jane')
  })

  it('stops bad pattern', async () => {
    const config = { redirects: [{ source: '/bad/{greeting}{name}', to: '/{name}' }] }
    const args = originRequest(config, '/bad/hi')
    expect(args[0]).to.be.instanceof(Error)
  })

  it('prevents double segment', async () => {
    const config = { redirects: [{ source: '/hi/{name}/{name}', to: '/hey/{name}' }] }
    const args = originRequest(config, '/hi/jane/jane')
    expect(args[0]).to.be.instanceof(Error)
  })

  it('prevents bad redirect object', async () => {
    const config = { redirects: [{ from: '/hi', to: '/hey' }] }
    const args = originRequest(config, '/hi')
    expect(args[0]).to.be.instanceof(Error)
  })

  it('prevents reserved segment', async () => {
    const config = { redirects: [{ source: '/hi/{length}', to: '/hey/{length}' }] }
    const args = originRequest(config, '/hi/jane')
    expect(args[0]).to.be.instanceof(Error)
  })

  it('prevents non-existant segment', async () => {
    const config = { redirects: [{ source: '/hi', to: '/hey/{name}' }] }
    const args = originRequest(config, '/hi')
    expect(args[0]).to.be.instanceof(Error)
  })

  it('does not append html to result url', async () => {
    const config = {
      cleanUrls: true,
      redirects: [{ source: '/hi/**', to: '/hey/$1' }]
    }
    const args = originRequest(config, '/hi/test')
    expect(args[1].status).to.equal('301')
    expect(args[1].headers.location[0].value).to.equal('/hey/test')
  })

  it('errors with no leading slash on source', async () => {
    const config = { redirects: [{ source: 'test', to: '/hi' }] }
    const args = originRequest(config, '/test')
    expect(args[0]).to.be.instanceof(Error)
  })
})
