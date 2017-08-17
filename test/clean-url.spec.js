import { expect } from 'chai'
import { originRequest } from './helpers'

describe('integration: cleanUrls', () => {
  const config = {
    cleanUrls: ['/hi/**', '/hey*']
  }

  it('uses clean urls with sources (matches)', async () => {
    const args = originRequest(config, '/heyo.html')
    expect(args[1].status).to.equal('301')
    expect(args[1].headers.location[0].value).to.equal('/heyo')
  })

  it('uses clean urls with sources (does not match)', async () => {
    const args = originRequest(config, '/hello')
    expect(args[1].uri).to.equal('/hello')
  })

  it('uses clean urls for all', async () => {
    const config = { cleanUrls: true }
    const args = originRequest(config, '/hello')
    expect(args[1].uri).to.equal('/hello.html')
  })

  it('uses clean urls with html extension', async () => {
    const config = { cleanUrls: true }
    const args = originRequest(config, '/hello.html')
    expect(args[1].status).to.equal('301')
    expect(args[1].headers.location[0].value).to.equal('/hello')
  })

  it('uses clean urls with index file', async () => {
    const config = { cleanUrls: true }
    const args = originRequest(config, '/index.html')
    expect(args[1].status).to.equal('301')
    expect(args[1].headers.location[0].value).to.equal('/')
  })

  it('errors with no leading slash', async () => {
    const config = { cleanUrls: ['hi/*'] }
    const args = originRequest(config, '/hi/hey.html')
    expect(args[0]).to.be.instanceof(Error)
  })
})
