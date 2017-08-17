import { get } from '../utils/deep'
import { redirect } from './redirect'

const PATTERN_WWW = /^www\./

export default function (req, res, toWww) {
  /* can't do a ternary since it's a boolean */
  if (toWww === undefined) {
    return
  }

  if (typeof toWww !== 'boolean') {
    throw new TypeError('"www" must be a boolean')
  }

  /* get the host header */
  const host = get(req, 'headers.host.0.value')

  /* redirect to host with www */
  if (toWww && !PATTERN_WWW.test(host)) {
    const newHost = `www.${host}`
    return Object.assign(res, redirect(`${newHost}${req.uri}`))
  }

  /* redirect to host without www */
  if (!toWww && PATTERN_WWW.test(host)) {
    const newHost = host.replace(PATTERN_WWW, '')
    return Object.assign(res, redirect(`${newHost}${req.uri}`))
  }
}
