import bitsFetch from './bitsFetch'

/**
 * List saved connections for an app (decrypted server-side).
 *
 * @param {string} appSlug
 */
export const listConnections = appSlug =>
  bitsFetch(null, 'connections/list', { app_slug: appSlug }, 'GET')

export const getConnection = id => bitsFetch(null, 'connections/get', { id }, 'GET')

export const saveConnection = payload => bitsFetch(payload, 'connections/save')

export const updateConnection = payload => bitsFetch(payload, 'connections/update')

export const reauthorizeConnection = payload => bitsFetch(payload, 'connections/reauthorize')

export const deleteConnection = id => bitsFetch({ id }, 'connections/delete')

/**
 * Persist auth payload as a reusable connection.
 *
 * @returns {Promise<{ success: boolean, data: object }>}
 */
// export const persistConnection = ({
//   appSlug,
//   authType = 'oauth2',
//   connectionName,
//   accountName,
//   authDetails,
//   encryptKeys = []
// }) =>
//   saveConnection({
//     app_slug: appSlug,
//     auth_type: authType,
//     connection_name: connectionName,
//     account_name: accountName,
//     auth_details: authDetails,
//     encrypt_keys: encryptKeys
//   })
