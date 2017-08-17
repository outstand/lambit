import { expect } from 'chai'
import { run, headers } from './helpers'

describe('integration: cleanUrls', () => {
  const config = {
    cleanUrls: ['/hi/**', '/hey*']
  }

  it('uses clean urls with sources (matches)', async () => {
    const args = run(config, { uri: '/heyo.html', headers })
    console.log(args)
    expect(args[1].status).to.equal('301')
    expect(args[1].headers.location[0].value).to.equal('/heyo')
  })

  it('uses clean urls with sources (does not match)', async () => {
    const args = run(config, { uri: '/hello', headers })
    expect(args[1].uri).to.equal('/hello')
  })

  it('uses clean urls for all', async () => {
    const args = run({ cleanUrls: true }, { uri: '/hello', headers })
    expect(args[1].uri).to.equal('/hello.html')
  })

  it('uses clean urls with html extension', async () => {
    const args = run({ cleanUrls: true }, { uri: '/hello.html', headers })
    expect(args[1].status).to.equal('301')
    expect(args[1].headers.location[0].value).to.equal('/hello')
  })

  it('uses clean urls with index file', async () => {
    const args = run({ cleanUrls: true }, { uri: '/index.html', headers })
    expect(args[1].status).to.equal('301')
    expect(args[1].headers.location[0].value).to.equal('/')
  })
})
