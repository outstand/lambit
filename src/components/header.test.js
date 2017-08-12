import { expect } from 'chai'
import * as header from './header'

describe('unit: header', () => {
  it('isValidName', async () => {
    expect(header.isValidName('Hello')).to.equal(true)
    expect(header.isValidName('Content-Type')).to.equal(true)
    expect(header.isValidName('Content!Type')).to.equal(true)
    expect(header.isValidName('Content@Type')).to.equal(false)
    expect(header.isValidName('1234567890_')).to.equal(true)
  })
})
