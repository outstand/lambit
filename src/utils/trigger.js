import { get } from './deep'

/**
 * Returns the type of CloudFront trigger
 * that the Lambda function currently
 * running is attached to.
 */
export default function (req, res) {
  const pattern = /cloudfront/i

  const via = get(req, 'headers.via.0.value')
  const agent = get(req, 'headers.user-agent.0.value')

  return pattern.test(via) && pattern.test(agent)
    ? get(res, 'status')
      ? 'origin-response'
      : 'origin-request'
    : get(res, 'status')
      ? 'viewer-response'
      : 'viewer-request'
}
