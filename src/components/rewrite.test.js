import { expect } from 'chai'
import * as rewrite from './rewrite'

describe('unit: rewrite', () => {
  it('default', async () => {
    expect(() => rewrite.default({}, {}, 'hi')).to.throw(TypeError)
  })
})
