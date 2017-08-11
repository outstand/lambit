import { expect } from 'chai'
import { run } from './helpers'

describe('unit: index (auth - basic)', () => {
  const config = {
    auth: {
      username: 'jason',
      password: 'password'
    }
  }

  it('prompts for credentials', async () => {
    const { args } = run(config, { uri: '/' })
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
    const { args } = run(config, { uri: '/', headers })
    expect(args[1].uri).to.equal('/')
  })

  it('stops invalid credentials', async () => {
    const headers = {
      authorization: [{
        key: 'Authorization',
        value: 'Basic amFzb246aGVsbG8='
      }]
    }
    const { args } = run(config, { uri: '/', headers })
    expect(args[1].status).to.equal('401')
    expect(args[1].body).to.match(/not authorized/)
  })
})
