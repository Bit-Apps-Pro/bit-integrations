import { reauthorizeConnection, saveConnection } from './connectionApi'

export const AUTH_TYPES = Object.freeze({
  NO_AUTH: 'no_auth',
  OAUTH2: 'oauth2',
  API_KEY: 'api_key',
  BEARER_TOKEN: 'bearer_token',
  BASIC_AUTH: 'basic_auth',
  CUSTOM: 'custom'
})

export const defaultEncryptKeys = {
  [AUTH_TYPES.API_KEY]: ['value'],
  [AUTH_TYPES.BASIC_AUTH]: ['password'],
  [AUTH_TYPES.BEARER_TOKEN]: ['token'],
  [AUTH_TYPES.OAUTH2]: ['client_secret', 'access_token', 'refresh_token']
}

export const isNoAuthType = authType => authType === AUTH_TYPES.NO_AUTH

export const normalizeAuthType = authType =>
  Object.values(AUTH_TYPES).includes(authType) ? authType : AUTH_TYPES.OAUTH2

