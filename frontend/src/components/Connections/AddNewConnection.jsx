import { add, set } from 'lodash'
import { AUTH_TYPES, defaultEncryptKeys } from '../../Utils/connectionAuth'
import { __ } from '../../Utils/i18nwrap'
import LoaderSm from '../Loaders/LoaderSm'
import toast from 'react-hot-toast'
import { useState } from 'react'
import { authorizeConnection, saveConnection } from '../../Utils/connectionApi'

export default function AddNewConnection({
  authDetails,
  config,
  setConfig,
  isInfo = false,
  setShowNextButton,
  customAuthFields
}) {
  const [authData, setAuthData] = useState({})
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({ connectionName: '' })
  const { authType, apiEndpoint, method } = authDetails || {}

  const handleChange = e => {
    const { name, value } = e.target
    setAuthData(prev => ({ ...prev, [name]: value }))
  }

  const resetErrors = () => {
    setErrors({ connectionName: '' })
  }

  const handleAuthorize = () => {
    resetErrors()
    if (!authData.connectionName) {
      setErrors({ connectionName: __('Connection name is required', 'bit-integrations') })
      return
    }

    if (authType === AUTH_TYPES.API_KEY && !authData.api_key) {
      setErrors(prev => ({ ...prev, api_key: __('API key is required', 'bit-integrations') }))
      return
    }

    if (authType === AUTH_TYPES.BASIC_AUTH && (!authData.username || !authData.password)) {
      setErrors(prev => ({
        ...prev,
        username: !authData.username ? __('Username is required', 'bit-integrations') : '',
        password: !authData.password ? __('Password is required', 'bit-integrations') : ''
      }))
      return
    }

    if (authType === AUTH_TYPES.BEARER_TOKEN && !authData.token) {
      setErrors(prev => ({ ...prev, token: __('Bearer token is required', 'bit-integrations') }))
      return
    }

    let payload = {
      auth_type: authType,
      api_endpoint: apiEndpoint || '',
      method: method || 'GET',
      auth_details: {}
    }

    if (authType === AUTH_TYPES.API_KEY) {
      payload.auth_details = { key: authDetails?.key || 'X-API-Key', value: authData.api_key, addTo: authData.addTo || 'header' }
    } else if (authType === AUTH_TYPES.BASIC_AUTH) {
      payload.auth_details = { username: authData.username, password: authData.password }
    } else if (authType === AUTH_TYPES.BEARER_TOKEN) {
      payload.auth_details = { token: authData.token }
    }

    setIsLoading(true)
    authorizeConnection(payload).then(res => {
      if (res?.success) {
        saveConnection({
          app_slug: config?.app_slug || config?.type,
          auth_type: authType,
          connection_name: authData.connectionName,
          account_name: authData.connectionName,
          auth_details: payload.auth_details,
          encrypt_keys: defaultEncryptKeys[authType] || []
        }).then(saveRes => {
          if (saveRes?.success) {
            const connection = saveRes?.data?.data || null
            setConfig(prev => ({ ...prev, connection_id: connection?.id }))
            setIsAuthorized(true)
            setShowNextButton(true)
            toast.success(__('Authorized Successfully', 'bit-integrations'))
          } else {
            toast.error(
              `${__('Failed to save connection Cause:', 'bit-integrations')}${saveRes?.data?.data || saveRes?.data || ''
              }. ${__('please try again', 'bit-integrations')}`
            )
          }
        })
      } else {
        setIsAuthorized(false)
        toast.error(
          `${__('Authorization failed Cause:', 'bit-integrations')}${res?.data?.data || res?.data || 'Unknown error'}. ${__('please try again', 'bit-integrations')}`
        )
      }
      setIsLoading(false)
    })
  }

  return (
    <>
      <div className="mt-3">
        <b>{__('Connection Name:', 'bit-integrations')}</b>
      </div>
      <input
        className="btcd-paper-inp w-6 mt-1"
        onChange={handleChange}
        name="connectionName"
        value={authData?.connectionName || ''}
        type="text"
        placeholder={__('Connection Name...', 'bit-integrations')}
      />
      <div style={{ color: 'red', fontSize: '15px' }}>{errors?.connectionName}</div>

      {authType === AUTH_TYPES.API_KEY && (
        <>
          <div className="mt-3">
            <b>{__('API Key:', 'bit-integrations')}</b>
          </div>
          <input
            className="btcd-paper-inp w-6 mt-1"
            onChange={handleChange}
            name="api_key"
            value={authData.api_key ?? ''}
            type="text"
            placeholder={__('api_key', 'bit-integrations')}
            disabled={isInfo}
          />
          <div style={{ color: 'red', fontSize: '15px' }}>{errors?.api_key || ''}</div>

          {/* <div className="mt-3">
          <b>{__('API Key Value:', 'bit-integrations')}</b>
        </div>
        <input
          className="btcd-paper-inp w-6 mt-1"
          onChange={handleChange}
          name="value"
          value={authData.value ?? ''}
          type="text"
          placeholder={__('Your API key...', 'bit-integrations')}
          disabled={isInfo}
        />
        <div style={{ color: 'red', fontSize: '15px' }}>{errors.value || ''}</div> */}

          {/* <div className="mt-3">
          <b>{__('Send Key Via:', 'bit-integrations')}</b>
        </div>
        <select
          className="btcd-paper-inp w-6 mt-1"
          onChange={handleChange}
          name="addTo"
          value={authData.addTo || 'header'}
          disabled={isInfo}>
          <option value="header">{__('Header', 'bit-integrations')}</option>
          <option value="query_params">{__('Query Params', 'bit-integrations')}</option>
        </select>
        <div style={{ color: 'red', fontSize: '15px' }}>{errors.addTo || ''}</div> */}
        </>
      )}

      {authType === AUTH_TYPES.BASIC_AUTH && (
        <>
          <div className="mt-3">
            <b>{__('Username:', 'bit-integrations')}</b>
          </div>
          <input
            className="btcd-paper-inp w-6 mt-1"
            onChange={handleChange}
            name="username"
            value={authData.username ?? ''}
            type="text"
            placeholder={__('Username...', 'bit-integrations')}
            disabled={isInfo}
          />
          <div style={{ color: 'red', fontSize: '15px' }}>{errors?.username || ''}</div>

          <div className="mt-3">
            <b>{__('Password:', 'bit-integrations')}</b>
          </div>
          <input
            className="btcd-paper-inp w-6 mt-1"
            onChange={handleChange}
            name="password"
            value={authData.password ?? ''}
            type="password"
            placeholder={__('Password...', 'bit-integrations')}
            disabled={isInfo}
          />
          <div style={{ color: 'red', fontSize: '15px' }}>{errors?.password || ''}</div>
        </>
      )}

      {authType === AUTH_TYPES.BEARER_TOKEN && (
        <>
          <div className="mt-3">
            <b>{__('Bearer Token:', 'bit-integrations')}</b>
          </div>
          <input
            className="btcd-paper-inp w-6 mt-1"
            onChange={handleChange}
            name="token"
            value={authData.token ?? ''}
            type="text"
            placeholder={__('Bearer token...', 'bit-integrations')}
            disabled={isInfo}
          />
          <div style={{ color: 'red', fontSize: '15px' }}>{errors?.token || ''}</div>
        </>
      )}

      {customAuthFields}

      <button
        onClick={handleAuthorize}
        className="btn btcd-btn-lg purple mt-3 sh-sm flx"
        type="button"
        disabled={isInfo}>
        {isAuthorized ? __('Authorized ✔', 'bit-integrations') : __('Authorize', 'bit-integrations')}
        {isLoading && <LoaderSm size={20} clr="#022217" className="ml-2" />}
      </button>
    </>
  )
}
