export function info (...msg) {
  process.env.NODE_ENV !== 'testing' &&
    console.log(...msg)
}

export function error (...msg) {
  process.env.NODE_ENV !== 'testing' &&
    console.error(...msg)
}
