/* eslint-disable react-hooks/exhaustive-deps */
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { __ } from '../../../Utils/i18nwrap'
import DokanActions from './DokanActions'
import 'react-multiple-select-dropdown-lite/dist/index.css'

import DokanFieldMap from './DokanFieldMap'
import { addFieldMap } from './IntegrationHelpers'
import { dokanStaticFields, getDokanEUFields, getAllVendors } from './dokanCommonFunctions'
import { TASK_LIST, TASK_LIST_VALUES } from './dokanConstants'
import Loader from '../../Loaders/Loader'
import TableCheckBox from '../../Utilities/TableCheckBox'

export default function DokanIntegLayout({
  formFields,
  dokanConf,
  setDokanConf,
  loading,
  setLoading,
  setSnackbar
}) {
  const setChanges = (val) => {
    const newConf = { ...dokanConf }
    newConf.selectedTask = val

    if (val) {
      const fieldsAndFieldMap = dokanStaticFields(val)
      newConf.staticFields = fieldsAndFieldMap.staticFields
      newConf.field_map = fieldsAndFieldMap.fieldMap

      if (val === TASK_LIST_VALUES.CREATE_VENDOR || val === TASK_LIST_VALUES.UPDATE_VENDOR) {
        getDokanEUFields(newConf, setDokanConf, loading, setLoading)
      } else if (
        val === TASK_LIST_VALUES.DELETE_VENDOR ||
        val === TASK_LIST_VALUES.WITHDRAW_REQUEST
      ) {
        getAllVendors(newConf, setDokanConf, loading, setLoading)
      }
    } else {
      newConf.staticFields = []
      newConf.field_map = []
    }

    setDokanConf({ ...newConf })
  }

  const handleMultiSelectChange = (val, type) => {
    const newConf = { ...dokanConf }
    newConf[type] = val
    setDokanConf({ ...newConf })
  }

  const handleDeleteTopicFieldMapCheck = (event) => {
    const newConf = { ...dokanConf }

    if (event.target.checked) {
      newConf.deleteVendorFieldMap = true
    } else {
      newConf.deleteVendorFieldMap = false
    }

    setDokanConf({ ...newConf })
  }

  return (
    <>
      <div>
        <div className="flx mt-3 mb-4">
          <b className="wdt-200 d-in-b">{__('Select Task:', 'bit-integrations')}</b>
          <MultiSelect
            style={{ width: '450px' }}
            options={TASK_LIST}
            className="msl-wrp-options"
            defaultValue={dokanConf?.selectedTask}
            onChange={(val) => setChanges(val)}
            singleSelect
          />
        </div>

        {dokanConf.selectedTask === TASK_LIST_VALUES.REFUND_REQUEST && (
          <span className="action-delete-task-note">
            The Dokan Pro plugin needs to be installed and activated to use this (Refund Request)
            task.
          </span>
        )}
        {(loading.euFields || loading.vendors) && (
          <Loader
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 45,
              transform: 'scale(0.5)'
            }}
          />
        )}

        {(dokanConf.selectedTask === TASK_LIST_VALUES.UPDATE_VENDOR ||
          dokanConf.selectedTask === TASK_LIST_VALUES.DELETE_VENDOR ||
          dokanConf.selectedTask === TASK_LIST_VALUES.WITHDRAW_REQUEST) && (
          <>
            <div className="flx mt-3 mb-4">
              <b className="wdt-200 d-in-b">{__('Select Vendor:', 'bit-integrations')}</b>
              <MultiSelect
                style={{ width: '450px' }}
                options={dokanConf?.vendors}
                className="msl-wrp-options"
                defaultValue={dokanConf?.selectedVendor}
                onChange={(val) => handleMultiSelectChange(val, 'selectedVendor')}
                singleSelect
              />
              <button
                onClick={() => getAllVendors(dokanConf, setDokanConf, loading, setLoading)}
                className="icn-btn sh-sm ml-2 mr-2 tooltip"
                style={{ '--tooltip-txt': `${__('Refresh Vendors', 'bit-integrations')}'` }}
                type="button">
                &#x21BB;
              </button>
            </div>
            {dokanConf.selectedTask === TASK_LIST_VALUES.DELETE_VENDOR && (
              <>
                <br />
                <div className="flx">
                  <span className="action-delete-task-note">
                    {__(
                      'To delete a vendor, you can select a vendor from the list above, or you can map fields',
                      'bit-integrations'
                    )}
                  </span>
                  <TableCheckBox
                    checked={dokanConf.deleteVendorFieldMap}
                    onChange={(e) => handleDeleteTopicFieldMapCheck(e)}
                    className=" ml-2"
                    value="select_group"
                    title={__('Map Fields', 'bit-integrations')}
                  />
                </div>
              </>
            )}
          </>
        )}

        {dokanConf.selectedTask === TASK_LIST_VALUES.WITHDRAW_REQUEST && (
          <div className="flx mt-3 mb-4">
            <b className="wdt-200 d-in-b">{__('Select Payment Method:', 'bit-integrations')}</b>
            <MultiSelect
              style={{ width: '450px' }}
              options={[
                { label: __('PayPal', 'bit-integrations'), value: 'paypal' },
                { label: __('Bank Transfer', 'bit-integrations'), value: 'bank' },
                { label: __('Skrill', 'bit-integrations'), value: 'skrill' }
              ]}
              className="msl-wrp-options"
              defaultValue={dokanConf?.selectedPaymentMethod}
              onChange={(val) => handleMultiSelectChange(val, 'selectedPaymentMethod')}
              singleSelect
            />
          </div>
        )}

        {(dokanConf.selectedTask !== TASK_LIST_VALUES.DELETE_VENDOR ||
          (dokanConf.selectedTask === TASK_LIST_VALUES.DELETE_VENDOR &&
            dokanConf.deleteVendorFieldMap)) && (
          <>
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
                <b>{__('Dokan Fields', 'bit-integrations')}</b>
              </div>
            </div>
          </>
        )}

        {((dokanConf?.selectedTask && dokanConf?.selectedTask !== TASK_LIST_VALUES.DELETE_VENDOR) ||
          (dokanConf.selectedTask === TASK_LIST_VALUES.DELETE_VENDOR &&
            dokanConf.deleteVendorFieldMap)) &&
          dokanConf?.field_map.map((itm, i) => (
            <DokanFieldMap
              key={`rp-m-${i + 9}`}
              i={i}
              field={itm}
              dokanConf={dokanConf}
              formFields={formFields}
              setDokanConf={setDokanConf}
              setSnackbar={setSnackbar}
            />
          ))}

        {((dokanConf?.selectedTask && dokanConf?.selectedTask !== TASK_LIST_VALUES.DELETE_VENDOR) ||
          (dokanConf.selectedTask === TASK_LIST_VALUES.DELETE_VENDOR &&
            dokanConf.deleteVendorFieldMap)) && (
          <div className="txt-center btcbi-field-map-button mt-2">
            <button
              onClick={() =>
                addFieldMap(dokanConf.field_map.length, dokanConf, setDokanConf, false)
              }
              className="icn-btn sh-sm"
              type="button">
              +
            </button>
          </div>
        )}

        {(dokanConf.selectedTask === TASK_LIST_VALUES.CREATE_VENDOR ||
          dokanConf.selectedTask === TASK_LIST_VALUES.UPDATE_VENDOR) && (
          <div>
            <br />
            <br />
            <div className="mt-4">
              <b className="wdt-100">{__('Utilities', 'bit-integrations')}</b>
            </div>
            <div className="btcd-hr mt-1" />
            <DokanActions
              dokanConf={dokanConf}
              setDokanConf={setDokanConf}
              loading={loading}
              setLoading={setLoading}
            />
          </div>
        )}
      </div>
    </>
  )
}
