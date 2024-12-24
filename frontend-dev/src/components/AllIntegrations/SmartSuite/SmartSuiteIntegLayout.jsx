/* eslint-disable no-unused-vars */
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useRecoilValue } from 'recoil'
import { $btcbi } from '../../../GlobalStates'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import { addFieldMap } from './IntegrationHelpers'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import SmartSuiteActions from './SmartSuiteActions'
import { getAllSolutions, getAllTables, generateMappedField } from './SmartSuiteCommonFunc'
import SmartSuiteFieldMap from './SmartSuiteFieldMap'
import { checkIsPro, getProLabel } from '../../Utilities/ProUtilHelpers'

import { create } from 'mutative'

export default function SmartSuiteIntegLayout({
  formFields,
  handleInput,
  smartSuiteConf,
  setSmartSuiteConf,
  loading,
  setLoading,
  isLoading,
  setIsLoading,
  setSnackbar
}) {
  const btcbi = useRecoilValue($btcbi)
  //const isPro = true
  const { isPro } = btcbi

  const setChanges = (val, name) => {
    if (!isPro) return

    if (name === 'selectedSolution' && val !== '' && smartSuiteConf?.actionName === 'record') {
      getAllTables(smartSuiteConf, setSmartSuiteConf, val, setLoading)
    }

    setSmartSuiteConf((prevConf) => {
      const newConf = { ...prevConf }
      newConf[name] = val
      if (
        name === 'selectedTable' &&
        val != '' &&
        newConf?.selectedTable &&
        newConf?.selectedTable != ''
      ) {
        const findItem = newConf.tables.find((item) => item.id === val)
        let customFieldsForRecord = []
        findItem.customFields.forEach((item) => {
          if (!excludeList.includes(item.slug)) {
            customFieldsForRecord.push({
              label: item.label,
              key: item.slug,
              required: item?.params?.required || false
            })
          }
        })
        newConf.smartSuiteFields = customFieldsForRecord
        newConf.field_map = generateMappedField(newConf.smartSuiteFields)
      } else newConf.customFields = null

      if (name === 'selectedSolution') {
        delete newConf.selectedTable
        delete newConf.tables
      } else if (name === 'selectedTable') {
        delete newConf['priority']
        delete newConf['status']
        delete newConf['assigned_to']
      }
      return newConf
    })
  }
  const handleCustomFieldForRecord = (actionName, value) => {
    if (actionName === 'record') {
      if (value != null && value != '') return true
      return false
    }
    return true
  }

  const handleActionInput = (value, name) => {
    setSmartSuiteConf((prevConf) =>
      create(prevConf, (draftConf) => {
        draftConf.field_map = [{ formField: '', smartSuiteFormField: '' }]
        draftConf.isActionTable = value
        if (draftConf?.selectedSolution) delete draftConf.selectedSolution
        if (draftConf?.selectedTable) delete draftConf.selectedTable
        if (value != '') {
          draftConf[name] = value
          if (isPro && (value === 'table' || value === 'record')) {
            getAllSolutions(smartSuiteConf, setSmartSuiteConf, setLoading)
          }
        } else {
          delete draftConf[name]
        }

        if (value === 'solution') {
          draftConf.smartSuiteFields = draftConf?.solutionFields
        } else if (isPro && value === 'table') {
          draftConf.smartSuiteFields = draftConf?.tableFields
        } else if (isPro && value === 'record') {
          delete draftConf['priority']
          delete draftConf['status']
          delete draftConf['assigned_to']
        }
        draftConf.field_map = generateMappedField(draftConf.smartSuiteFields)
      })
    )
  }

  return (
    <>
      <br />
      <div className="flx">
        <b className="wdt-200 d-in-b">{__('Select Action:', 'bit-integrations')}</b>
        {/* <select
          onChange={handleActionInput}
          name="actionName"
          value={smartSuiteConf.actionName}
          disabled={loading.solution || loading.table}
          className="btcd-paper-inp w-5">
          <option value="">{__('Select an action', 'bit-integrations')}</option>
          <option value="solution" data-action_name="solution">
            {__('Create Solution', 'bit-integrations')}
          </option>
          <option disabled={true} value="table" data-action_name="table">
            {getProLabel(__('Create Table', 'bit-integrations'))}
          </option>
          <option value="record" data-action_name="record" disabled={true}>
            {getProLabel(__('Create Record', 'bit-integrations'))}
          </option>
        </select> */}

        <MultiSelect
          defaultValue={smartSuiteConf?.actionName}
          value={smartSuiteConf.actionName}
          disabled={loading.solution || loading.table}
          className="mt-2 w-5"
          onChange={(val) => handleActionInput(val, 'actionName')}
          options={smartSuiteConf?.actionTypes?.map((actionType) => ({
            label: checkIsPro(isPro, actionType.is_pro)
              ? actionType.label
              : getProLabel(actionType.label),
            value: actionType.name,
            disabled: checkIsPro(isPro, actionType.is_pro) ? false : true
          }))}
          singleSelect
          closeOnSelect
        />
      </div>
      {smartSuiteConf.actionName &&
        isPro &&
        (smartSuiteConf.isActionTable === 'table' || smartSuiteConf.isActionTable === 'record') &&
        !loading.solution && (
          <>
            <br />
            <br />
            <div className="flx">
              <b className="wdt-200 d-in-b">{__('Select Solution:', 'bit-integrations')}</b>
              <MultiSelect
                options={
                  smartSuiteConf?.solutions &&
                  smartSuiteConf.solutions.map((solution) => ({
                    label: solution.name,
                    value: `${solution.id}`
                  }))
                }
                className="msl-wrp-options dropdown-custom-width"
                defaultValue={smartSuiteConf?.selectedSolution}
                onChange={(val) => setChanges(val, 'selectedSolution')}
                singleSelect
                closeOnSelect
                disabled={loading.solution || loading.table}
              />
              <button
                onClick={() => getAllSolutions(smartSuiteConf, setSmartSuiteConf, setLoading)}
                className="icn-btn sh-sm ml-2 mr-2 tooltip"
                style={{ '--tooltip-txt': `'${__('Refresh Solution', 'bit-integrations')}'` }}
                type="button"
                disabled={loading.solution}>
                &#x21BB;
              </button>
            </div>
          </>
        )}

      {(loading.solution || loading.table) && (
        <Loader
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 100,
            transform: 'scale(0.7)'
          }}
        />
      )}
      {smartSuiteConf.actionName &&
        smartSuiteConf?.selectedSolution &&
        smartSuiteConf?.selectedSolution != '' &&
        !loading.solution &&
        !loading.table &&
        isPro &&
        smartSuiteConf.isActionTable === 'record' && (
          <>
            <br />
            <br />
            <div className="flx">
              <b className="wdt-200 d-in-b">{__('Select Table:', 'bit-integrations')}</b>

              <MultiSelect
                options={
                  smartSuiteConf?.tables &&
                  smartSuiteConf.tables.map((table) => ({
                    label: table.name,
                    value: `${table.id}`
                  }))
                }
                className="msl-wrp-options dropdown-custom-width"
                defaultValue={smartSuiteConf?.selectedTable}
                onChange={(val) => setChanges(val, 'selectedTable')}
                singleSelect
                closeOnSelect
              />
              <button
                onClick={() =>
                  getAllTables(
                    smartSuiteConf,
                    setSmartSuiteConf,
                    smartSuiteConf?.selectedSolution,
                    setLoading
                  )
                }
                className="icn-btn sh-sm ml-2 mr-2 tooltip"
                style={{ '--tooltip-txt': `'${__('Refresh Table', 'bit-integrations')}'` }}
                type="button"
                disabled={loading.solution}>
                &#x21BB;
              </button>
            </div>
          </>
        )}

      {handleCustomFieldForRecord(smartSuiteConf.actionName, smartSuiteConf.selectedTable) &&
        smartSuiteConf.actionName &&
        !isLoading && (
          <div>
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
                <b>{__('SmartSuite Fields', 'bit-integrations')}</b>
              </div>
            </div>
            {smartSuiteConf?.field_map.map((itm, i) => (
              <SmartSuiteFieldMap
                key={`rp-m-${i + 9}`}
                i={i}
                field={itm}
                smartSuiteConf={smartSuiteConf}
                formFields={formFields}
                setSmartSuiteConf={setSmartSuiteConf}
                setSnackbar={setSnackbar}
              />
            ))}
            {(smartSuiteConf.actionName === 'solution' || smartSuiteConf.actionName === 'record') && (
              <div className="txt-center btcbi-field-map-button mt-2">
                <button
                  onClick={() =>
                    addFieldMap(
                      smartSuiteConf.field_map.length,
                      smartSuiteConf,
                      setSmartSuiteConf,
                      false
                    )
                  }
                  className="icn-btn sh-sm"
                  type="button">
                  +
                </button>
              </div>
            )}
            <br />
            <br />
            <br />
            {(smartSuiteConf.actionName === 'solution' ||
              (smartSuiteConf.actionName === 'record' &&
                smartSuiteConf?.selectedTable &&
                smartSuiteConf?.selectedTable != '')) && (
              <div>
                <div className="mt-4">
                  <b className="wdt-100">{__('Utilities', 'bit-integrations')}</b>
                </div>
                <div className="btcd-hr mt-1" />
                <SmartSuiteActions
                  smartSuiteConf={smartSuiteConf}
                  setSmartSuiteConf={setSmartSuiteConf}
                  formFields={formFields}
                  loading={loading}
                  setLoading={setLoading}
                />
              </div>
            )}
          </div>
        )}
    </>
  )
}

const excludeList = [
  'assigned_to',
  'priority',
  'status',
  'first_created',
  'last_updated',
  'followed_by',
  'comments_count',
  'autonumber'
]
