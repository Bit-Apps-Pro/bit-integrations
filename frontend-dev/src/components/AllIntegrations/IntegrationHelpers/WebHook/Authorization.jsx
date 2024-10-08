import React, { useEffect } from 'react'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import CloseIcn from '../../../../Icons/CloseIcn'
import EyeIcon from '../../../../Icons/EyeIcon'
import TrashIcn from '../../../../Icons/TrashIcn'
import { __ } from '../../../../Utils/i18nwrap'
import Button from '../../../Utilities/Button'

function Authorization({ webHooks, setWebHooks, isInfo, setTab }) {
  useEffect(() => {
    setTab(4)
  }, [])

  const handleInput = (e) => {
    const tmpConfConf = { ...webHooks }
    tmpConfConf[e.target.name] = e.target.value
    setWebHooks({ ...tmpConfConf })
  }

  const handleAuthConfig = (e) => {
    const tmpConf = { ...webHooks }
    const { name, value } = e.target
    if (!tmpConf.authConfig) {
      tmpConf.authConfig = {}
    }
    tmpConf.authConfig[name] = value
    setWebHooks(tmpConf)
  }
  return (
    <div>
      <div className="w-4 mr-2 mt-2">
        <select
          className="btcd-paper-inp mt-1"
          onChange={handleInput}
          name="authType"
          defaultValue={webHooks?.authType}
          disabled={isInfo}>
          <option>{__('Select Authorization', 'bit-integrations')}</option>
          <option value="Basic">{__('Basic', 'bit-integrations')}</option>
          <option value="Bearer">{__('Bearer Token', 'bit-integrations')}</option>
        </select>
      </div>
      <div className="w-4 mt-3">
        {webHooks?.authType === 'Basic' && (
          <>
            <input
              className="btcd-paper-inp p-i-sm"
              onChange={handleAuthConfig}
              value={webHooks?.authConfig?.username}
              name="username"
              placeholder={__('Username', 'bit-integrations')}
              type="text"
              disabled={isInfo}
            />
            <input
              className="btcd-paper-inp p-i-sm mt-3"
              onChange={handleAuthConfig}
              value={webHooks?.authConfig?.password}
              name="password"
              placeholder={__('Password', 'bit-integrations')}
              type="password"
              disabled={isInfo}
            />
          </>
        )}
        {webHooks?.authType === 'Bearer' && (
          <input
            className="btcd-paper-inp p-i-sm"
            onChange={handleAuthConfig}
            value={webHooks?.authConfig?.token}
            placeholder={__('Token', 'bit-integrations')}
            name="token"
            type="text"
            disabled={isInfo}
          />
        )}
      </div>
    </div>
  )
}

export default Authorization
