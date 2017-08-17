import { expect } from 'chai'
import { run } from './helpers'

describe('integration: index', () => {
  it('default request passed through', async () => {
    const args = run({}, { uri: '/' })
    expect(args[1].uri).to.equal('/')
  })
})
