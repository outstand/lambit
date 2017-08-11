import { expect } from 'chai'
import redirect from './redirect'

describe('unit: redirect', () => {
  it('returns object', async () => {
    const res = redirect('https://google.com')
    expect(res.status).to.equal('301')
    expect(res.statusDescription).to.equal('Moved Permanently')
    expect(res.body).to.equal('Redirecting to https://google.com')
    expect(res.headers.contentType[0].value).to.match(/^text\/plain/)
    expect(res.headers.location[0]).to.deep.equal({
      key: 'Location',
      value: 'https://google.com'
    })
  })

  it('with custom code', async () => {
    const res = redirect('https://google.com', 302)
    expect(res.status).to.equal('302')
    expect(res.statusDescription).to.equal('Found')
  })

  it('with custom code as string', async () => {
    const res = redirect('https://google.com', '302')
    expect(res.status).to.equal('302')
    expect(res.statusDescription).to.equal('Found')
  })

  it('with invalid code', async () => {
    expect(() => redirect('google.com', 400)).to.throw()
  })
})
