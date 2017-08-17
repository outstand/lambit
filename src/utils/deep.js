export function get (obj, path, defaultVal) {
  if (obj === undefined || obj === null) {
    return defaultVal
  }

  if (typeof path === 'string') {
    path = path.split('.')
  }

  if (path.length === 0) {
    return obj
  }

  const found = obj[path[0]]
  const remaining = path.slice(1)

  return get(found, remaining, defaultVal)
}
