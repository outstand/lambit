import { expect } from 'chai'
import sinon from 'sinon'
import lambchop from './index'

describe('unit: index', () => {
  const config = {
    redirects: [
      { from: '/hi', to: '/hey' },
      { from: '/hello', to: '/whatup', code: 302 }
    ]
  }

  it('without anything', async () => {
    const spy = sinon.spy()
    const request = { uri: '/' }
    const evt = { Records: [{ cf: { request } }] }
    lambchop(config)(evt, null, spy)
    expect(spy.calledWith(null, request)).to.equal(true)
  })

  it('redirects (array)', async () => {
    const spy = sinon.spy()
    const request = { uri: '/hello' }
    const evt = { Records: [{ cf: { request } }] }
    lambchop(config)(evt, null, spy)
    expect(spy.args[0][1].status).to.equal('302')
    expect(spy.args[0][1].headers.location[0].value).to.equal('/whatup')
  })

  it('redirects (object)', async () => {
    const spy = sinon.spy()
    const request = { uri: '/hello' }
    const evt = { Records: [{ cf: { request } }] }
    lambchop({
      redirects: {
        '/hello': '/whatup'
      }
    })(evt, null, spy)
    expect(spy.args[0][1].status).to.equal('301')
    expect(spy.args[0][1].headers.location[0].value).to.equal('/whatup')
  })
})
