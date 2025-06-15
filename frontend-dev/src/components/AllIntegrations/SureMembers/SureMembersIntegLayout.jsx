/* eslint-disable react-hooks/exhaustive-deps */
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { __ } from '../../../Utils/i18nwrap'
import SureMembersActions from './SureMembersActions'
import 'react-multiple-select-dropdown-lite/dist/index.css'

import SureMembersFieldMap from './SureMembersFieldMap'
import { addFieldMap } from './IntegrationHelpers'

export default function SureMembersIntegLayout({
  formFields,
  sureMembersConf,
  setSureMembersConf,
  loading,
  setLoading,
  setSnackbar
}) {
  const setChanges = (val) => {
    const newConf = { ...sureMembersConf }
    newConf.selectedTask = val
    setSureMembersConf({ ...newConf })
  }

  return (
    <>
      <div>
        <div className="flx mt-3">
          <b className="wdt-200 d-in-b">{__('Select Task:', 'bit-integrations')}</b>
          <MultiSelect
            style={{ width: '450px' }}
            options={[
              { label: __('Add User to Access Group', 'bit-integrations'), value: 'grantAccess' },
              {
                label: __('Remove User from Access Group', 'bit-integrations'),
                value: 'revokeAccess'
              }
            ]}
            className="msl-wrp-options"
            defaultValue={sureMembersConf?.selectedTask}
            onChange={(val) => setChanges(val)}
            singleSelect
          />
        </div>
        <br />
        <div className="mt-5">
          <b className="wdt-100">{__('Field Map', 'bit-integrations')}</b>
        </div>
        <br />
        <div className="btcd-hr mt-1" />
        <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
          <div className="txt-dp">
            <b>{__('Form Fields', 'bit-integrations')}</b>
          </div>
          <div className="txt-dp">
            <b>{__('SureMembers Fields', 'bit-integrations')}</b>
          </div>
        </div>

        {sureMembersConf?.selectedTask &&
          sureMembersConf?.field_map.map((itm, i) => (
            <SureMembersFieldMap
              key={`rp-m-${i + 9}`}
              i={i}
              field={itm}
              sureMembersConf={sureMembersConf}
              formFields={formFields}
              setSureMembersConf={setSureMembersConf}
              setSnackbar={setSnackbar}
            />
          ))}
        {sureMembersConf?.selectedTask && (
          <div>
            <div className="txt-center btcbi-field-map-button mt-2">
              <button
                onClick={() =>
                  addFieldMap(
                    sureMembersConf.field_map.length,
                    sureMembersConf,
                    setSureMembersConf,
                    false
                  )
                }
                className="icn-btn sh-sm"
                type="button">
                +
              </button>
            </div>
            <br />
            <br />
            <div className="mt-4">
              <b className="wdt-100">{__('Utilities', 'bit-integrations')}</b>
            </div>
            <div className="btcd-hr mt-1" />
            <SureMembersActions
              sureMembersConf={sureMembersConf}
              setSureMembersConf={setSureMembersConf}
              loading={loading}
              setLoading={setLoading}
            />
          </div>
        )}
      </div>
    </>
  )
}
