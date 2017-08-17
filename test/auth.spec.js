import { expect } from 'chai'
import { run } from './helpers'

describe('integration: auth (basic)', () => {
  const config = {
    auth: {
      source: '/admin**',
      username: 'jason',
      password: 'password'
    }
  }

  it('prompts for credentials', async () => {
    const args = run(config, { uri: '/admin' })
    expect(args[1].status).to.equal('401')
    expect(args[1].headers['www-authenticate'][0].value).to.equal('Basic')
  })

  it('prompts for credentials with subpath', async () => {
    const args = run(config, { uri: '/admin/hello' })
    expect(args[1].status).to.equal('401')
    expect(args[1].headers['www-authenticate'][0].value).to.equal('Basic')
  })

  it('accepts valid credentials', async () => {
    const headers = {
      authorization: [{
        key: 'Authorization',
        value: 'Basic amFzb246cGFzc3dvcmQ='
      }]
    }
    const args = run(config, { uri: '/admin', headers })
    expect(args[1].uri).to.equal('/admin')
  })

  it('stops invalid credentials', async () => {
    const headers = {
      authorization: [{
        key: 'Authorization',
        value: 'Basic amFzb246aGVsbG8='
      }]
    }
    const args = run(config, { uri: '/admin', headers })
    expect(args[1].status).to.equal('401')
    expect(args[1].body).to.match(/not authorized/)
  })

  it('ignores unmatched path', async () => {
    const args = run(config, { uri: '/' })
    expect(args[1].uri).to.equal('/')
  })

  it('ignores unmatched subpath', async () => {
    const args = run({
      auth: {
        source: '/test*'
      }
    }, { uri: '/test/hi' })
    expect(args[1].uri).to.equal('/test/hi')
  })
})
