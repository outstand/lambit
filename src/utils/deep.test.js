import { expect } from 'chai'
import * as deep from './deep'

describe('unit: deep-get', () => {
  it('default', async () => {
    const obj = { test: 'test', hi: { hey: { whatup: 'yo', arr: ['one', 'two'] } } }
    expect(deep.get(obj, 'test')).to.equal('test')
    expect(deep.get(obj, 'hi.hey.whatup')).to.equal('yo')
    expect(deep.get(obj, ['hi', 'hey', 'whatup'])).to.equal('yo')
    expect(deep.get(obj, 'hi.hey.wazzup', 'yoyo')).to.equal('yoyo')
    expect(deep.get(obj, 'hi.hello.hi', 1)).to.equal(1)
    expect(deep.get(obj, 'hi.hey.arr')).to.deep.equal(['one', 'two'])
    expect(deep.get(obj, 'hi.hey.arrr', [])).to.deep.equal([])
    expect(deep.get(obj, 'hi.hey.arr.1')).to.equal('two')
  })
})
