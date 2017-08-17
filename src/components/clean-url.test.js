import { expect } from 'chai'
import * as clean from './clean-url'

describe('unit: clean-url', () => {
  it('default', async () => {
    expect(() => clean.default({}, {}, 'hi')).to.throw(TypeError)
  })

  it('isDirty', async () => {
    expect(clean.isDirty('/hello.html')).to.equal(true)
    expect(clean.isDirty('/hello.htm')).to.equal(true)
    expect(clean.isDirty('/hello.htmll')).to.equal(false)
    expect(clean.isDirty('/hello.ht')).to.equal(false)
    expect(clean.isDirty('/hello')).to.equal(false)
    expect(clean.isDirty('/hello/')).to.equal(false)
    expect(clean.isDirty('/hello.')).to.equal(false)
    expect(clean.isDirty('/hello.css')).to.equal(false)
    expect(clean.isDirty('/index.html')).to.equal(true)
    expect(clean.isDirty('/index.htm')).to.equal(true)
    expect(clean.isDirty('/index.css')).to.equal(false)
    expect(clean.isDirty('/index')).to.equal(true)
    expect(clean.isDirty('/index/')).to.equal(false)
  })

  it('cleanup', async () => {
    expect(clean.cleanup('/hello.html')).to.equal('/hello')
    expect(clean.cleanup('/hello.htm')).to.equal('/hello')
    expect(clean.cleanup('/hello.css')).to.equal('/hello.css')
    expect(clean.cleanup('/hello.html/')).to.equal('/hello.html/')
    expect(clean.cleanup('/hello')).to.equal('/hello')
    expect(clean.cleanup('/index.html')).to.equal('/')
    expect(clean.cleanup('/index.htm')).to.equal('/')
    expect(clean.cleanup('/index')).to.equal('/')
    expect(clean.cleanup('/index.')).to.equal('/index.')
    expect(clean.cleanup('/hi/index.html')).to.equal('/hi/')
    expect(clean.cleanup('/hi/index.html/')).to.equal('/hi/index.html/')
    expect(clean.cleanup('/hi/index')).to.equal('/hi/')
    expect(clean.cleanup('/hi/index/')).to.equal('/hi/index/')
    expect(clean.cleanup('/index.css')).to.equal('/index.css')
  })

  it('addExtension', async () => {
    expect(clean.addExtension('/hello')).to.equal('/hello.html')
    expect(clean.addExtension('/hello/')).to.equal('/hello/')
    expect(clean.addExtension('/hello.css')).to.equal('/hello.css')
    expect(clean.addExtension('/hello.')).to.equal('/hello.')
  })
})
