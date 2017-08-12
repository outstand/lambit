import { expect } from 'chai'
import { run, headers } from './helpers'

describe('integration: cleanUrls', () => {
  it('uses clean urls', async () => {
    const { args } = run({ cleanUrls: true }, { uri: '/hello', headers })
    expect(args[1].uri).to.equal('/hello.html')
  })

  it('uses clean urls (html extension)', async () => {
    const { args } = run({ cleanUrls: true }, { uri: '/hello.html', headers })
    expect(args[1].status).to.equal('301')
    expect(args[1].headers.location[0].value).to.equal('/hello')
  })

  it('uses clean urls (index file)', async () => {
    const { args } = run({ cleanUrls: true }, { uri: '/index.html', headers })
    expect(args[1].status).to.equal('301')
    expect(args[1].headers.location[0].value).to.equal('/')
  })
})
