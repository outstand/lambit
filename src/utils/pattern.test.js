import { expect } from 'chai'
import * as pattern from './pattern'

describe('unit: pattern', () => {
  it('escapeRegex', async () => {
    expect(pattern.escapeRegex('[a-z]')).to.equal('\\[a\\-z\\]')
    expect(pattern.escapeRegex('hello**hi')).to.equal('hello\\*\\*hi')
  })

  it('toRegex', async () => {
    expect(pattern.toRegex('/{name}')).to.deep.equal(new RegExp('^/[^/\\s]+$'))
    expect(pattern.toRegex('/hello{name}')).to.deep.equal(new RegExp('^/hello[^/\\s]+$'))
    expect(pattern.toRegex('/hello/{name}')).to.deep.equal(new RegExp('^/hello/[^/\\s]+$'))
    expect(pattern.toRegex('/hello/{name}/')).to.deep.equal(new RegExp('^/hello/[^/\\s]+/$'))
    expect(pattern.toRegex('/hello$')).to.deep.equal(new RegExp('^/hello\\$$'))
    expect(pattern.toRegex('/hello$')).to.deep.equal(new RegExp('^/hello\\$$'))
    expect(pattern.toRegex('/hello*')).to.deep.equal(new RegExp('^/hello[^/\\s]*$'))
    expect(pattern.toRegex('/hello/*')).to.deep.equal(new RegExp('^/hello/[^/\\s]*$'))
    expect(pattern.toRegex('/hello/**')).to.deep.equal(new RegExp('^/hello/[^\\s]*$'))
    expect(pattern.toRegex('/hello/*/hi')).to.deep.equal(new RegExp('^/hello/[^/\\s]*/hi$'))
    expect(pattern.toRegex('/hello*/**/hi')).to.deep.equal(new RegExp('^/hello[^/\\s]*/[^\\s]*/hi$'))
    expect(pattern.toRegex('/*')).to.deep.equal(new RegExp('^/[^/\\s]*$'))
    expect(pattern.toRegex('/**')).to.deep.equal(new RegExp('^/[^\\s]*$'))
  })

  it('matches', async () => {
    expect(pattern.matches('/*', '/hello')).to.equal(true)
    expect(pattern.matches('/**', '/hello')).to.equal(true)
    expect(pattern.matches('/*', '/hello/hi')).to.equal(false)
    expect(pattern.matches('/**', '/hello/hi')).to.equal(true)
    expect(pattern.matches('/**', '/hello/hi/')).to.equal(true)
    expect(pattern.matches('/**', '/really/long/path/yo')).to.equal(true)
    expect(pattern.matches('/hello', '/hello')).to.equal(true)
    expect(pattern.matches('/hello*', '/helloo')).to.equal(true)
    expect(pattern.matches('/hello*', '/hello/')).to.equal(false)
    expect(pattern.matches('/hello**', '/hello/')).to.equal(true)
    expect(pattern.matches('/hello*', '/hello/hi')).to.equal(false)
    expect(pattern.matches('/hello**', '/hello/hi')).to.equal(true)
    expect(pattern.matches('/{name}', '/')).to.equal(false)
    expect(pattern.matches('/{name}', '/jason')).to.equal(true)
    expect(pattern.matches('/hello/{name}', '/hello/jason')).to.equal(true)
    expect(pattern.matches('/hello/{name}', '/hello/')).to.equal(false)
    expect(pattern.matches('/hello-{name}', '/hello-jason')).to.equal(true)
    expect(pattern.matches('/he*o-{name}', '/hello-jason')).to.equal(true)
    expect(pattern.matches('/he*o-{name}', '/heyo-jason')).to.equal(true)
    expect(pattern.matches(/\.jpg$/, '/hi.jpg')).to.equal(true)
    expect(pattern.matches(/\.jpg$/, '/hi.jp')).to.equal(false)
  })
})
