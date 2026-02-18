export const APP_CONFIG = window.bit_integrations_ ?? {}

APP_CONFIG.withPrefix = function (key) {
  return `bit_integrations_${key}`
}
