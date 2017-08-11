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
    const creds = { username: 'jason', password: 'password' }
    expect(auth.decode('Basic amFzb246cGFzc3dvcmQ=')).to.deep.equal(creds)
    expect(auth.decode('amFzb246cGFzc3dvcmQ=')).to.deep.equal(creds)
    expect(auth.decode(' basic     amFzb246cGFzc3dvcmQ=')).to.deep.equal(creds)
  })
})
