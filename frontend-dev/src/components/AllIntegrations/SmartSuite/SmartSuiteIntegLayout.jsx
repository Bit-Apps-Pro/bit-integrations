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
import { getCustomFields } from './SmartSuiteCommonFunc'
import SmartSuiteFieldMap from './SmartSuiteFieldMap'
import CustomField from './CustomField'

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

  const setChanges = (val, name) => {
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
        newConf.customFields = findItem.customFields
        if (newConf.isActionTable === 'solution' || newConf.isActionTable === 'table') {
          newConf.field_map = generateMappedField(newConf.smartSuiteFields)
        } else if (newConf.isActionTable === 'record') {
          newConf.field_map = generateMappedField(newConf.smartSuiteFieldsForRecord)
        }
        //getCustomFields(smartSuiteConf, setSmartSuiteConf, setIsLoading, val)
      } else newConf.customFields = null

      if (name === 'selectedSolution') {
        delete newConf.selectedTable
        delete newConf.tables
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

  const handleActionInput = (e) => {
    const newConf = { ...smartSuiteConf }
    const { name } = e.target
    newConf.field_map = [{ formField: '', smartSuiteFormField: '' }]
    newConf.customFields = null
    if (newConf?.selectedSolution) delete newConf?.selectedSolution
    if (newConf?.selectedTable) delete newConf?.selectedTable
    if (e.target.value != '') {
      newConf[name] = e.target.value
      if (e.target.value === 'table' || e.target.value === 'record') {
        getAllSolutions(smartSuiteConf, setSmartSuiteConf, setLoading)
      }
    } else {
      delete newConf[name]
    }
    newConf.isActionTable = e.target.value
    if (newConf.isActionTable === 'solution' || newConf.isActionTable === 'table') {
      newConf.field_map = generateMappedField(newConf.smartSuiteFields)
    } else if (newConf.isActionTable === 'record') {
      newConf.field_map = generateMappedField(newConf.smartSuiteFieldsForRecord)
    }
    setSmartSuiteConf({ ...newConf })
  }

  return (
    <>
      <br />
      <b className="wdt-200 d-in-b">{__('Select Action:', 'bit-integrations')}</b>
      <select
        onChange={handleActionInput}
        name="actionName"
        value={smartSuiteConf.actionName}
        disabled={loading.solution || loading.table}
        className="btcd-paper-inp w-5">
        <option value="">{__('Select an action', 'bit-integrations')}</option>
        <option value="solution" data-action_name="contact">
          {__('Create Solution', 'bit-integrations')}
        </option>
        <option value="table" data-action_name="campaign">
          {__('Create Table', 'bit-integrations')}
        </option>
        <option value="record" data-action_name="campaign">
          {__('Create Record', 'bit-integrations')}
        </option>
      </select>

      {smartSuiteConf.actionName &&
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
                customFields="asas"
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
              {smartSuiteConf.actionName === 'record1' && (
                <button
                  onClick={() => getCustomFields(smartSuiteConf, setSmartSuiteConf, setIsLoading)}
                  className="icn-btn sh-sm ml-2 mr-2 tooltip"
                  style={{ '--tooltip-txt': `'${__('Refresh fields', 'bit-integrations')}'` }}
                  type="button"
                  disabled={loading.CRMPipelines}>
                  &#x21BB;
                </button>
              )}
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
