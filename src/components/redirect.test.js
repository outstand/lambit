import { expect } from 'chai'
import * as redirect from './redirect'

describe('unit: redirect', () => {
  it('redirect', async () => {
    const res = redirect.redirect('https://google.com')
    expect(res.status).to.equal('301')
    expect(res.statusDescription).to.equal('Moved Permanently')
    expect(res.body).to.equal('Redirecting to https://google.com')
    expect(res.headers.contentType[0].value).to.match(/^text\/plain/)
    expect(res.headers.location[0]).to.deep.equal({
      key: 'Location',
      value: 'https://google.com'
    })
  })

  it('redirect (custom code)', async () => {
    const res = redirect.redirect('https://google.com', 302)
    expect(res.status).to.equal('302')
    expect(res.statusDescription).to.equal('Found')
  })

  it('redirect (custom code as string)', async () => {
    const res = redirect.redirect('https://google.com', '302')
    expect(res.status).to.equal('302')
    expect(res.statusDescription).to.equal('Found')
  })

  it('redirect (invalid code)', async () => {
    expect(() => redirect.redirect('google.com', 400)).to.throw()
  })
})
