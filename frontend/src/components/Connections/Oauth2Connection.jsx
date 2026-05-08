import { useCallback, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { AUTH_TYPES, defaultEncryptKeys } from '../../Utils/connectionAuth'
import { saveConnection } from '../../Utils/connectionApi'
import {
  buildAuthUrl,
  exchangeAuthCodeForToken,
  exchangeClientCredentialsForToken,
  generateCodeChallengeS256,
  generateCodeVerifier,
  getCallbackState,
  getRedirectUri,
  openOauthPopup
} from '../../Utils/oauthHelper'
import { __ } from '../../Utils/i18nwrap'
import LoaderSm from '../Loaders/LoaderSm'
import CopyText from '../Utilities/CopyText'
import { APP_CONFIG } from '../../config/app'

const ERROR_TEXT_STYLE = { color: 'red', fontSize: '15px' }
const READONLY_INPUT_STYLE = { backgroundColor: '#f5f5f5' }

const GRANT_TYPES = Object.freeze({
  AUTHORIZATION_CODE: 'authorization_code',
  AUTHORIZATION_CODE_PKCE: 'authorization_code_pkce',
  CLIENT_CREDENTIALS: 'client_credentials'
})

const buildSavedAuthDetails = ({
  tokenResponse,
  clientId,
  clientSecret,
  clientAuthentication,
  grantType,
  refreshTokenUrl,
  tokenUrl,
  scope,
  sslVerify
}) => {
  const expiresIn = Number(tokenResponse?.expires_in) || 0
  const persistedGrantType =
    grantType === GRANT_TYPES.AUTHORIZATION_CODE_PKCE ? GRANT_TYPES.AUTHORIZATION_CODE : grantType

  return {
    access_token: tokenResponse?.access_token || '',
    refresh_token: tokenResponse?.refresh_token || '',
    token_type: tokenResponse?.token_type || 'Bearer',
    expires_in: expiresIn,
    generated_at: Math.floor(Date.now() / 1000),
    client_id: clientId,
    client_secret: clientSecret,
    clientAuthentication,
    grant_type: persistedGrantType,
    refresh_token_url: refreshTokenUrl || tokenUrl,
    scope: scope || '',
    ssl_verify: sslVerify !== false,
    raw_response: tokenResponse
  }
}

export default function Oauth2Connection({
  authDetails,
  config,
  setConfig,
  isInfo = false,
  customAuthFields,
  onConnectionSaved
}) {
  const [formData, setFormData] = useState({})
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthorized, setIsAuthorized] = useState(false)

  const {
    authCodeEndpoint,
    tokenEndpoint,
    refreshTokenUrl,
    grantType = GRANT_TYPES.AUTHORIZATION_CODE,
    clientAuthentication = 'body',
    scope,
    sslVerify = true
  } = authDetails || {}

  const redirectUri = useMemo(() => getRedirectUri(), [])

  const handleChange = useCallback(event => {
    const { name, value } = event.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }, [])

  const validate = useCallback(() => {
    const next = {}
    if (!formData.connectionName?.trim()) {
      next.connectionName = __('Connection name is required', 'bit-integrations')
    }
    if (!formData.clientId?.trim()) {
      next.clientId = __('Client ID is required', 'bit-integrations')
    }
    if (!formData.clientSecret?.trim()) {
      next.clientSecret = __('Client secret is required', 'bit-integrations')
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }, [formData])

  const storeConnection = useCallback(
    async authPayload => {
      const saveRes = await saveConnection({
        app_slug: config?.app_slug || config?.type,
        auth_type: AUTH_TYPES.OAUTH2,
        connection_name: formData.connectionName,
        account_name: formData.connectionName,
        auth_details: authPayload,
        encrypt_keys: defaultEncryptKeys[AUTH_TYPES.OAUTH2] || []
      })

      if (!saveRes?.success) {
        const reason = saveRes?.data?.data || saveRes?.data || ''
        toast.error(`${__('Failed to save connection Cause:', 'bit-integrations')}${reason}`)
        return null
      }

      const connection = saveRes?.data?.data || null
      setConfig(prev => ({ ...prev, connection_id: connection?.id }))

      if (onConnectionSaved) await onConnectionSaved(connection)

      setIsAuthorized(true)
      toast.success(__('Authorized Successfully', 'bit-integrations'))
      return connection
    },
    [config, formData.connectionName, onConnectionSaved, setConfig]
  )

  const handleAuthorizationCodeFlow = useCallback(async () => {
    const isPkce = grantType === GRANT_TYPES.AUTHORIZATION_CODE_PKCE
    let codeVerifier
    const extraParams = { ...(authCodeEndpoint?.queryParams?.client_id ? {} : { client_id: formData.clientId }) }

    if (!authCodeEndpoint?.queryParams?.response_type) extraParams.response_type = 'code'
    if (scope && !authCodeEndpoint?.queryParams?.scope) extraParams.scope = scope

    if (isPkce) {
      codeVerifier = generateCodeVerifier()
      extraParams.code_challenge = await generateCodeChallengeS256(codeVerifier)
      extraParams.code_challenge_method = 'S256'
    }

    const populatedAuthCodeEndpoint = {
      ...authCodeEndpoint,
      queryParams: {
        ...(authCodeEndpoint?.queryParams || {}),
        ...(authCodeEndpoint?.queryParams?.client_id ? { client_id: formData.clientId } : {})
      }
    }

    const state = getCallbackState()
    const authUrl = buildAuthUrl(populatedAuthCodeEndpoint, { state, redirectUri, extraParams })
    const popupResponse = await openOauthPopup(authUrl, formData.connectionName || 'OAuth')

    if (popupResponse?.error) {
      throw new Error(
        popupResponse.error === 'popup_blocked'
          ? __('Popup blocked. Please allow popups and try again.', 'bit-integrations')
          : __('Authorization window closed before completing.', 'bit-integrations')
      )
    }

    if (!popupResponse?.code) {
      throw new Error(popupResponse?.error_description || __('Authorization code missing', 'bit-integrations'))
    }

    const tokenRes = await exchangeAuthCodeForToken({
      tokenEndpoint,
      clientId: formData.clientId,
      clientSecret: formData.clientSecret,
      clientAuthentication,
      code: popupResponse.code,
      codeVerifier,
      redirectUri,
      sslVerify
    })

    if (!tokenRes?.success) {
      throw new Error(tokenRes?.data?.message || __('Token exchange failed', 'bit-integrations'))
    }

    return tokenRes?.data?.data || {}
  }, [authCodeEndpoint, clientAuthentication, formData, grantType, redirectUri, scope, sslVerify, tokenEndpoint])

  const handleClientCredentialsFlow = useCallback(async () => {
    const tokenRes = await exchangeClientCredentialsForToken({
      tokenEndpoint,
      clientId: formData.clientId,
      clientSecret: formData.clientSecret,
      clientAuthentication,
      scope,
      sslVerify
    })

    if (!tokenRes?.success) {
      throw new Error(tokenRes?.data?.message || __('Token exchange failed', 'bit-integrations'))
    }

    return tokenRes?.data?.data || {}
  }, [clientAuthentication, formData.clientId, formData.clientSecret, scope, sslVerify, tokenEndpoint])

  const handleAuthorize = useCallback(async () => {
    if (!validate()) return

    setIsLoading(true)
    try {
      let tokenResponse
      if (grantType === GRANT_TYPES.CLIENT_CREDENTIALS) {
        tokenResponse = await handleClientCredentialsFlow()
      } else {
        tokenResponse = await handleAuthorizationCodeFlow()
      }

      const savedAuthDetails = buildSavedAuthDetails({
        tokenResponse,
        clientId: formData.clientId,
        clientSecret: formData.clientSecret,
        clientAuthentication,
        grantType,
        refreshTokenUrl,
        tokenUrl: tokenEndpoint?.url,
        scope,
        sslVerify
      })

      await storeConnection(savedAuthDetails)
    } catch (error) {
      setIsAuthorized(false)
      toast.error(`${__('Authorization failed Cause:', 'bit-integrations')} ${error?.message || 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }, [
    clientAuthentication,
    formData.clientId,
    formData.clientSecret,
    grantType,
    handleAuthorizationCodeFlow,
    handleClientCredentialsFlow,
    storeConnection,
    refreshTokenUrl,
    scope,
    sslVerify,
    tokenEndpoint?.url,
    validate
  ])

  const isAuthCodeFlow =
    grantType === GRANT_TYPES.AUTHORIZATION_CODE ||
    grantType === GRANT_TYPES.AUTHORIZATION_CODE_PKCE

  return (
    <>
      <div className="mt-3">
        <b>{__('Connection Name:', 'bit-integrations')}</b>
      </div>
      <input
        className="btcd-paper-inp w-6 mt-1"
        onChange={handleChange}
        name="connectionName"
        value={formData.connectionName || ''}
        type="text"
        placeholder={__('Connection Name...', 'bit-integrations')}
      />
      <div style={ERROR_TEXT_STYLE}>{errors.connectionName || ''}</div>

      {isAuthCodeFlow && (
        <>
          <div className="mt-3">
            <b>{__('Homepage URL:', 'bit-integrations')}</b>
          </div>
          <CopyText
            value={`${APP_CONFIG?.siteURL || ''}`}
            className="field-key-cpy w-6 ml-0"
            readOnly={isInfo}
          />
          <div className="mt-3">
            <b>{__('Callback / Redirect URL:', 'bit-integrations')}</b>
          </div>
          <CopyText
            value={redirectUri}
            className="field-key-cpy w-6 ml-0"
            readOnly={isInfo}
          />
        </>
      )}

      <div className="mt-3">
        <b>{__('Client ID:', 'bit-integrations')}</b>
      </div>
      <input
        className="btcd-paper-inp w-6 mt-1"
        onChange={handleChange}
        name="clientId"
        value={formData.clientId || ''}
        type="text"
        placeholder={__('Client ID...', 'bit-integrations')}
        disabled={isInfo}
      />
      <div style={ERROR_TEXT_STYLE}>{errors.clientId || ''}</div>

      <div className="mt-3">
        <b>{__('Client Secret:', 'bit-integrations')}</b>
      </div>
      <input
        className="btcd-paper-inp w-6 mt-1"
        onChange={handleChange}
        name="clientSecret"
        value={formData.clientSecret || ''}
        type="password"
        placeholder={__('Client Secret...', 'bit-integrations')}
        disabled={isInfo}
      />
      <div style={ERROR_TEXT_STYLE}>{errors.clientSecret || ''}</div>

      {customAuthFields}

      <button
        onClick={handleAuthorize}
        className="btn btcd-btn-lg purple mt-3 sh-sm flx"
        type="button"
        disabled={isInfo || isLoading}>
        {isAuthorized ? __('Authorized ✔', 'bit-integrations') : __('Authorize', 'bit-integrations')}
        {isLoading && <LoaderSm size={20} clr="#022217" className="ml-2" />}
      </button>
    </>
  )
}
