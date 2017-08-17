import { expect } from 'chai'
import * as auth from './auth'

describe('unit: auth', () => {
  it('default', async () => {
    expect(auth.default({}, {})).to.equal(undefined)
    expect(() => auth.default({}, {}, 'hi')).to.throw(TypeError)
  })

  it('decode', async () => {
    const creds = { username: 'jane', password: 'password' }
    expect(auth.decode('Basic amFuZTpwYXNzd29yZA==')).to.deep.equal(creds)
    expect(auth.decode('amFuZTpwYXNzd29yZA==')).to.deep.equal(creds)
    expect(auth.decode(' basic     amFuZTpwYXNzd29yZA==')).to.deep.equal(creds)
    expect(auth.decode('MToy')).to.deep.equal({ username: '1', password: '2' })
    expect(auth.decode('1')).to.deep.equal({ username: '', password: '' })
  })

  it('notAuthorized', async () => {
    const res = {}
    auth.notAuthorized(res)
    expect(res.status).to.equal('401')
    expect(res.body).to.match(/not authorized/)
    expect(res.headers['www-authenticate'][0].value).to.equal('Basic')
    expect(res.headers['content-type'][0].value).to.match(/text\/plain/)
  })
})
