import { expect } from 'chai'
import * as protect from './protect'

describe('unit: protect', () => {
  it('default', async () => {
    expect(protect.default({}, {})).to.equal(undefined)
    expect(() => protect.default({}, {}, 'hi')).to.throw(TypeError)
  })

  it('decode', async () => {
    const creds = { username: 'jane', password: 'password' }
    expect(protect.decode('Basic amFuZTpwYXNzd29yZA==')).to.deep.equal(creds)
    expect(protect.decode('amFuZTpwYXNzd29yZA==')).to.deep.equal(creds)
    expect(protect.decode(' basic     amFuZTpwYXNzd29yZA==')).to.deep.equal(creds)
    expect(protect.decode('MToy')).to.deep.equal({ username: '1', password: '2' })
    expect(protect.decode('1')).to.deep.equal({ username: '', password: '' })
  })

  it('notAuthorized', async () => {
    const res = {}
    protect.notAuthorized(res)
    expect(res.status).to.equal('401')
    expect(res.body).to.match(/not authorized/)
    expect(res.headers['www-authenticate'][0].value).to.equal('Basic')
    expect(res.headers['content-type'][0].value).to.match(/text\/plain/)
  })
})
