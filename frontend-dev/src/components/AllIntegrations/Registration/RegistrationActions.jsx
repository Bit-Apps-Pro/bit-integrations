/* eslint-disable no-param-reassign */
// eslint-disable-next-line import/no-extraneous-dependencies
import { useState } from 'react'
import { __ } from '../../../Utils/i18nwrap'
import TableCheckBox from '../../Utilities/TableCheckBox'
import ConfirmModal from '../../Utilities/ConfirmModal'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { getUserRoles } from './UserHelperFunction'
import Loader from '../../Loaders/Loader'
import { create } from 'mutative'

export default function RegistrationActions({ userConf, setUserConf }) {
  const [actionMdl, setActionMdl] = useState({ show: false, action: () => {} })
  const [roles, setRoles] = useState()
  const [isLoading, setIsLoading] = useState(false)

  const actionHandler = (e, name) => {
    const newConf = { ...userConf }

    if (name === 'user_role') {
      if (!roles) {
        getUserRoles(setIsLoading, setRoles)
      }
      setActionMdl({ show: 'user_role' })
    } else {
      if (e.target.checked) {
        newConf[name] = true
      } else {
        delete newConf[name]
      }
    }

    setUserConf({ ...newConf })
  }

  const setUserRole = (val) => {
    setUserConf((prevConf) =>
      create(prevConf, (draftConf) => {
        if (val) {
          draftConf['user_role'] = val
        } else {
          delete draftConf['user_role']
        }
      })
    )
  }

  const clsActionMdl = () => {
    setActionMdl({ show: false })
  }

  return (
    <div className="pos-rel d-flx w-8">
      {userConf?.action_type !== 'updated_user' && (
        <>
          <TableCheckBox
            checked={userConf?.user_notify || false}
            onChange={(e) => actionHandler(e, 'user_notify')}
            className="wdt-200 mt-4 mr-2"
            value="user_notify"
            title={__('User Email Notification', 'bit-integrations')}
            subTitle={__(
              'When this option is enabled, a welcome email will be sent from WordPress after registration.',
              'bit-integrations'
            )}
          />
          <TableCheckBox
            checked={userConf?.admin_notify || false}
            onChange={(e) => actionHandler(e, 'admin_notify')}
            className="wdt-200 mt-4 mr-2"
            value="admin_notify"
            title={__('Admin Email Notification', 'bit-integrations')}
            subTitle={__(
              'If this option is enabled, e-mail will be sent from WordPress to admin.',
              'bit-integrations'
            )}
          />
          <TableCheckBox
            checked={userConf?.auto_login || false}
            onChange={(e) => actionHandler(e, 'auto_login')}
            className="wdt-200 mt-4 mr-2"
            value="auto_login"
            title={__('Auto Login After Registration', 'bit-integrations')}
            subTitle={__(
              'if checked Auto Login, the user login automatically after registration.',
              'bit-integrations'
            )}
          />
        </>
      )}
      <TableCheckBox
        checked={userConf?.user_role || false}
        onChange={(e) => actionHandler(e, 'user_role')}
        className="wdt-200 mt-4 mr-2"
        value="user_role"
        title={
          userConf?.action_type !== 'updated_user'
            ? __('Add WP User Role', 'bit-integrations')
            : __('Update WP User Role', 'bit-integrations')
        }
        subTitle={
          userConf?.action_type !== 'updated_user'
            ? __('Add WP User Role', 'bit-integrations')
            : __('Update WP User Role', 'bit-integrations')
        }
      />

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="purple"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'user_role'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={
          userConf?.action_type !== 'updated_user'
            ? __('WP User Role', 'bit-integrations')
            : __('Update WP User Role', 'bit-integrations')
        }>
        <div className="btcd-hr mt-2 mb-2" />
        <div className="mt-2">{__('Select User Role', 'bit-integrations')}</div>
        {isLoading ? (
          <Loader
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 45,
              transform: 'scale(0.5)'
            }}
          />
        ) : (
          <>
            <div className="flx mt-2">
              <MultiSelect
                options={roles?.map((role) => ({
                  label: role?.name,
                  value: role?.key
                }))}
                className="msl-wrp-options"
                defaultValue={userConf?.user_role}
                onChange={(e) => setUserRole(e)}
                singleSelect
                closeOnSelect
              />
              <button
                onClick={() => getUserRoles(setIsLoading, setRoles)}
                className="icn-btn sh-sm ml-2 mr-2 tooltip"
                style={{ '--tooltip-txt': `${__('Refresh Roles', 'bit-integrations')}'` }}
                type="button">
                &#x21BB;
              </button>
            </div>
          </>
        )}
      </ConfirmModal>
    </div>
  )
}
