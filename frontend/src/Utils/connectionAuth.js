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
  [AUTH_TYPES.OAUTH2]: ['client_id', 'client_secret', 'access_token', 'refresh_token']
}

export const isNoAuthType = authType => authType === AUTH_TYPES.NO_AUTH

export const normalizeAuthType = authType =>
  Object.values(AUTH_TYPES).includes(authType) ? authType : AUTH_TYPES.OAUTH2

/**
 * Save or reauthorize a reusable connection.
 *
 * @returns {Promise<{success: boolean, data?: {data?: object}}>}
 */
export const persistConnectionAuthorization = ({
  appSlug,
  authType = AUTH_TYPES.OAUTH2,
  connectionId = null,
  connectionName = '',
  accountName = '',
  authDetails = {},
  encryptKeys = [],
  status
}) => {
  const sanitizedConnectionName = connectionName?.trim() || ''
  const sanitizedAccountName = accountName?.trim() || ''
  const normalizedAuthType = normalizeAuthType(authType)

  const payload = {
    auth_type: normalizedAuthType,
    auth_details: isNoAuthType(normalizedAuthType) ? {} : authDetails,
    encrypt_keys: Array.isArray(encryptKeys) ? encryptKeys : []
  }

  if (sanitizedConnectionName) payload.connection_name = sanitizedConnectionName
  if (sanitizedAccountName) payload.account_name = sanitizedAccountName
  if (typeof status === 'number') payload.status = status

  if (connectionId) {
    return reauthorizeConnection({ id: connectionId, ...payload })
  }

  return saveConnection({ app_slug: appSlug, ...payload })
}
