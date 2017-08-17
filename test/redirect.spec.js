import { expect } from 'chai'
import { run, headers } from './helpers'

describe('integration: redirects', () => {
  const config = {
    redirects: [
      { source: '/hi', to: '/hey' },
      { source: '/greet/{name}/hello', to: '/{name}/hello' },
      { source: '/hello', to: '/whatup', code: 302 },
      { source: '/yo/**', to: '/wazzup/$1' },
      { source: '/he*/{greeting}-{name}!/**', to: '/$2/{name}' },
      { source: 'http://mysite.com/{query}/**', to: 'https://google.com/$1/?q={query}' }
    ]
  }

  it('sends redirect response', async () => {
    const args = run(config, { uri: '/hi', headers })
    expect(args[1].status).to.equal('301')
    expect(args[1].headers.location[0].value).to.equal('/hey')
  })

  it('redirects with custom code', async () => {
    const args = run(config, { uri: '/hello', headers })
    expect(args[1].status).to.equal('302')
    expect(args[1].headers.location[0].value).to.equal('/whatup')
  })

  it('redirects with a hostname', async () => {
    const args = run(config, { uri: 'http://mysite.com/yoyo/search', headers })
    expect(args[1].status).to.equal('301')
    expect(args[1].headers.location[0].value).to.equal('https://google.com/search/?q=yoyo')
  })

  it('redirects with wildcard', async () => {
    const args = run(config, { uri: '/yo/yo', headers })
    expect(args[1].status).to.equal('301')
    expect(args[1].headers.location[0].value).to.equal('/wazzup/yo')
  })

  it('redirects with segment', async () => {
    const args = run(config, { uri: '/greet/jane/hello', headers })
    expect(args[1].status).to.equal('301')
    expect(args[1].headers.location[0].value).to.equal('/jane/hello')
  })

  it('redirects with crazy url', async () => {
    const args = run(config, { uri: '/hello/hey-jane!/whatup', headers })
    expect(args[1].status).to.equal('301')
    expect(args[1].headers.location[0].value).to.equal('/whatup/jane')
  })

  it('stops bad pattern', async () => {
    const args = run({
      redirects: [{ source: '/bad/{greeting}{name}', to: '/{name}' }]
    }, { uri: '/bad/hi', headers })
    expect(args[0]).to.be.instanceof(Error)
  })

  it('prevents double segment', async () => {
    const args = run({
      redirects: [{ source: '/hi/{name}/{name}', to: '/hey/{name}' }]
    }, { uri: '/hi/jane/jane', headers })
    expect(args[0]).to.be.instanceof(Error)
  })

  it('prevents bad redirect object', async () => {
    const args = run({
      redirects: [{ from: '/hi', to: '/hey' }]
    }, { uri: '/hi', headers })
    expect(args[0]).to.be.instanceof(Error)
  })

  it('prevents reserved segment', async () => {
    const args = run({
      redirects: [{ source: '/hi/{length}', to: '/hey/{length}' }]
    }, { uri: '/hi/jane', headers })
    expect(args[0]).to.be.instanceof(Error)
  })

  it('prevents non-existant segment', async () => {
    const args = run({
      redirects: [{ source: '/hi', to: '/hey/{name}' }]
    }, { uri: '/hi', headers })
    expect(args[0]).to.be.instanceof(Error)
  })

  it('does not append html to result url', async () => {
    const args = run({
      cleanUrls: true,
      redirects: [{ source: '/hi/**', to: '/hey/$1' }]
    }, { uri: '/hi/test', headers })
    expect(args[1].status).to.equal('301')
    expect(args[1].headers.location[0].value).to.equal('/hey/test')
  })
})
