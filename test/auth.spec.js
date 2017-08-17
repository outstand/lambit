import { expect } from 'chai'
import { viewerRequest } from './helpers'

describe('integration: auth (basic)', () => {
  const config = {
    auth: {
      source: '/admin**',
      username: 'jason',
      password: 'password'
    }
  }

  it('prompts for credentials', async () => {
    const args = viewerRequest(config, '/admin')
    expect(args[1].status).to.equal('401')
    expect(args[1].headers['www-authenticate'][0].value).to.equal('Basic')
  })

  it('prompts for credentials with subpath', async () => {
    const args = viewerRequest(config, '/admin/hello')
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
    const args = viewerRequest(config, '/admin', { headers })
    expect(args[1].uri).to.equal('/admin')
  })

  it('stops invalid credentials', async () => {
    const headers = {
      authorization: [{
        key: 'Authorization',
        value: 'Basic amFzb246aGVsbG8='
      }]
    }
    const args = viewerRequest(config, '/admin', { headers })
    expect(args[1].status).to.equal('401')
    expect(args[1].body).to.match(/not authorized/)
  })

  it('ignores unmatched path', async () => {
    const args = viewerRequest(config, '/')
    expect(args[1].uri).to.equal('/')
  })

  it('ignores unmatched subpath', async () => {
    const config = { auth: { source: '/test*' } }
    const args = viewerRequest(config, '/test/hi')
    expect(args[1].uri).to.equal('/test/hi')
  })

  it('errors with no leading slash on source', async () => {
    const config = { auth: { source: 'test' } }
    const args = viewerRequest(config, '/test')
    expect(args[0]).to.be.instanceof(Error)
  })
})
