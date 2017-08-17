import { get } from 'object-path'
import { redirect } from './redirect'

const PATTERN_WWW = /^www\./

// TODO: keep protocol with `headers.upgrade-insecure-request`?

export default function (req, res, toWww) {
  if (toWww === undefined) return

  const host = get(req, 'headers.host.0.value')

  if (toWww && !PATTERN_WWW.test(host)) {
    const newHost = `www.${host}`
    return Object.assign(res, redirect(`${newHost}${req.uri}`))
  }

  if (!toWww && PATTERN_WWW.test(host)) {
    const newHost = host.replace(PATTERN_WWW, '')
    return Object.assign(res, redirect(`${newHost}${req.uri}`))
  }
}
