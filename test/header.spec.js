import { expect } from 'chai'
import { run } from './helpers'

describe('integration: headers', () => {
  const config = {
    headers: [
      { name: 'Whatup', value: 'yoyo' },
      { name: 'Testing', value: 'Hello', source: '/admin**' }
    ]
  }

  it('adds custom headers', async () => {
    const res = { status: 200 }
    const { args } = run(config, { uri: '/' }, res)
    expect(args[1].headers.whatup[0].value).to.equal('yoyo')
    expect(args[1].headers.testing).to.equal(undefined)
  })

  it('stops invalid header name', async () => {
    const res = { status: 200 }
    const { args } = run({
      headers: [{ name: 'yo@yo', value: 'hi' }]
    }, { uri: '/' }, res)
    expect(args[0]).to.be.instanceof(Error)
  })

  it('adds custom headers with source', async () => {
    const res = { status: 200 }
    const { args } = run(config, { uri: '/admin' }, res)
    expect(args[1].headers.whatup[0].value).to.equal('yoyo')
    expect(args[1].headers.testing[0].value).to.equal('Hello')
  })
})
