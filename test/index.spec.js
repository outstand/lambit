import { expect } from 'chai'
import { run } from './helpers'

describe('integration: index', () => {
  // const now = Date.now()
  // const config1 = {
  //   headers: [
  //     { name: 'Server', value: 'Lambchop' },
  //     { name: 'Response-Time', value: () => now + 1 }
  //   ],
  //   redirects: [
  //     { from: '/hi', to: '/hey' },
  //     { from: '/greet/:name/hello', to: '/:name/hello' },
  //     { from: '/hello', to: '/whatup', code: 302 }
  //   ]
  // }

  it('default request passed through', async () => {
    const { args } = run({}, { uri: '/' })
    expect(args[1].uri).to.equal('/')
  })
})

  // it('adds custom headers', async () => {
  //   const spy = sinon.spy()
  //   const response = {}
  //   const evt = { Records: [{ cf: { response } }] }
  //   lambchop(config1)(evt, null, spy)
  //   expect(spy.args[0][1].headers.server[0]).to.deep.equal({
  //     key: 'Server',
  //     value: 'Lambchop'
  //   })
  //   expect(spy.args[0][1].headers['response-time'][0]).to.deep.equal({
  //     key: 'Response-Time',
  //     value: now + 1
  //   })
  // })
  //
  // it('sends redirect response', async () => {
  //   const spy = sinon.spy()
  //   const request = { uri: '/hello' }
  //   const evt = { Records: [{ cf: { request } }] }
  //   lambchop(config1)(evt, null, spy)
  //   expect(spy.args[0][1].status).to.equal('302')
  //   expect(spy.args[0][1].headers.location[0].value).to.equal('/whatup')
  // })
  //
  // it.skip('redirects with a placeholder', async () => {
  //   const spy = sinon.spy()
  //   const request = { uri: '/greet/jason/hello' }
  //   const evt = { Records: [{ cf: { request } }] }
  //   lambchop(config1)(evt, null, spy)
  //   expect(spy.args[0][1].status).to.equal('301')
  //   expect(spy.args[0][1].headers.location[0].value).to.equal('/jason/hello')
  // })
  //
  // it.skip('prevents non-existant placeholder', async () => {
  //   const spy = sinon.spy()
  //   const request = { uri: '/hi' }
  //   const evt = { Records: [{ cf: { request } }] }
  //   lambchop({
  //     redirects: [
  //       { from: '/hi', to: '/hey/:name' }
  //     ]
  //   })(evt, null, spy)
  //   expect(spy.args[0][0]).to.be.an.instanceof(Error)
  // })
  //
  // it('prevents double placeholder', async () => {
  //   const spy = sinon.spy()
  //   const request = { uri: '/hi/jason/jason' }
  //   const evt = { Records: [{ cf: { request } }] }
  //   lambchop({
  //     redirects: [
  //       { from: '/hi/:name/:name', to: '/hey/:name' }
  //     ]
  //   })(evt, null, spy)
  //   expect(spy.args[0][0]).to.be.an.instanceof(Error)
  // })
  //
  // it('prevents reserved placeholder', async () => {
  //   const spy = sinon.spy()
  //   const request = { uri: '/hi/jason' }
  //   const evt = { Records: [{ cf: { request } }] }
  //   lambchop({
  //     redirects: [
  //       { from: '/hi/:splat', to: '/hey/:splat' }
  //     ]
  //   })(evt, null, spy)
  //   expect(spy.args[0][0]).to.be.an.instanceof(Error)
  // })
