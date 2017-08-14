import { expect } from 'chai'
import * as auth from './auth'

describe('unit: auth', () => {
  it('notAuthorized', async () => {
    const res = {}
    auth.notAuthorized(res)
    expect(res.status).to.equal('401')
    expect(res.headers['www-authenticate'][0].value).to.equal('Basic')
  })

  it('decode', async () => {
    const creds = { username: 'jane', password: 'password' }
    expect(auth.decode('Basic amFuZTpwYXNzd29yZA==')).to.deep.equal(creds)
    expect(auth.decode('amFuZTpwYXNzd29yZA==')).to.deep.equal(creds)
    expect(auth.decode(' basic     amFuZTpwYXNzd29yZA==')).to.deep.equal(creds)
  })
})
