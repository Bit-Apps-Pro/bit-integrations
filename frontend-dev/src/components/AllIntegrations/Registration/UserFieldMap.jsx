import { useState } from 'react'
import { __ } from '../../../Utils/i18nwrap'
import Cooltip from '../../Utilities/Cooltip'
import SnackMsg from '../../Utilities/SnackMsg'
import TableCheckBox from '../../Utilities/TableCheckBox'
import FieldMap from './FieldMap'
import { addFieldMap } from './UserHelperFunction'

export default function UserFieldMap({ formFields, userConf, setUserConf, roles, userFields }) {
  const [snack, setSnackbar] = useState({ show: false })
  const handleInput = e => {
    const tmpConf = { ...userConf }
    const { name, value } = e.target
    tmpConf[name] = value
    setUserConf(tmpConf)
  }

  const handleCheckd = (e) => {
    const tmpConf = { ...userConf }
    const { name, checked } = e.target
    if (checked) {
      tmpConf[name] = true
    } else {
      delete tmpConf[name]
    }
    setUserConf(tmpConf)
  }

  return (
    <>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div>
        <div>
          <div>
            <div className="mt-3 mb-1">
              <b>{__('Field Mappping', 'bit-integrations')}</b>
            </div>
            <div className="btcd-hr" />
            <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
              <div className="txt-dp"><b>{__('Form Fields', 'bit-integrations')}</b></div>
              <div className="txt-dp">
                <b>{__('User Fields', 'bit-integrations')}</b>
              </div>
            </div>
          </div>

          {
            userConf?.user_map?.map((itm, i) => (
              <FieldMap
                key={`analytics-m-${i + 9}`}
                i={i}
                type="user"
                field={itm}
                formFields={formFields}
                userConf={userConf}
                setUserConf={setUserConf}
                customFields={userFields}
                setSnackbar={setSnackbar}
              />
            ))
          }

          <div className="txt-center btcbi-field-map-button mt-2"><button onClick={() => addFieldMap('user_map', userConf?.user_map?.length, userConf, setUserConf)} className="icn-btn sh-sm" type="button">+</button></div>

        </div>

        {userConf?.action_type !== 'updated_user' && (
          <div className="flx">
            <div className="w-5 mt-5 flx">
              <TableCheckBox name="user_notify" onChange={handleCheckd} title={__('User Email Notification', 'bit-integrations')} checked={!!userConf?.user_notify} value={false} />
              <Cooltip width={250} icnSize={17} className="ml-1">
                <div className="txt-body">
                  When this option is enabled, a welcome email will be sent from WordPress after registration.
                  <br />
                </div>
              </Cooltip>
            </div>
            <div className="w-5 mt-5 flx">
              <TableCheckBox name="admin_notify" onChange={handleCheckd} title={__('Admin Email Notification', 'bit-integrations')} checked={!!userConf?.admin_notify} value={false} />
              <Cooltip width={250} icnSize={17} className="ml-1">
                <div className="txt-body">
                  If this option is enabled, e-mail will be sent from WordPress to admin.
                  <br />
                </div>
              </Cooltip>
            </div>
          </div>
        )}
        <br />
        <br />

        {userConf?.action_type !== 'updated_user' && (
          <div className="flx integ-fld-wrp">
            <div className="w-5 ">
              <div className="f-m fw-500">{__('WP User Role', 'bit-integrations')}</div>
              <select name="user_role" onChange={handleInput} value={userConf?.user_role} className="btcd-paper-inp mt-1">
                <option disabled selected>Select User Role</option>
                {roles.map((role, index) => (
                  <option key={`acf-${index * 2}`} value={role?.key}>{role?.name}</option>
                ))}
              </select>
            </div>

            <div className="w-5 ml-2 mt-2 flx">
              <TableCheckBox name="auto_login" onChange={handleCheckd} title={__('Auto Login After Registration', 'bit-integrations')} checked={!!userConf?.auto_login} value={false} />
              <Cooltip width={250} icnSize={17} className="ml-1">
                <div className="txt-body">
                  if checked Auto Login, the user login automatically after registration.
                  <br />
                </div>
              </Cooltip>
            </div>
          </div>
        )}
      </div>

    </>
  )
}
