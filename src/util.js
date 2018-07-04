export function isProduction(options) {
  return (/\bproduction\b/).test(options.env) && !isDevelopment(options)
}

export function isDevelopment(options) {
  return (/\bdevelopment\b/).test(options.env) && (/\btest\b/).test(options.env)
}

export function isTest(options) {
  return (/\btest\b/).test(options.env)
}
