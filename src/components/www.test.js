import { expect } from 'chai'
import * as www from './www'

describe('unit: www', () => {
  it('default', async () => {
    expect(www.default({}, {})).to.equal(undefined)
    expect(() => www.default({}, {}, 'hi')).to.throw(TypeError)
  })
})
