/* eslint-disable no-unused-vars */
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import ZendeskActions from './ZendeskActions'
import { getAllCRMCompanies, getAllCRMContacts, getAllCRMSources, getCustomFields } from './ZendeskCommonFunc'
import ZendeskFieldMap from './ZendeskFieldMap'
import { addFieldMap } from './IntegrationHelpers'
import 'react-multiple-select-dropdown-lite/dist/index.css'

export default function ZendeskIntegLayout({ formFields, handleInput, zendeskConf, setZendeskConf, loading, setLoading, setSnackbar }) {
  const handleActionInput = (e) => {
    const newConf = { ...zendeskConf }
    newConf.field_map = [
      { formField: '', zendeskFormField: '' },
    ]
    const { name } = e.target
    if (e.target.value !== '') {
      newConf[name] = e.target.value
      getCustomFields(newConf, setZendeskConf, setLoading)
      if (e.target.value === 'lead') {
        getAllCRMCompanies(newConf, setZendeskConf, setLoading)
      } else if (e.target.value === 'deal') {
        getAllCRMContacts(newConf, setZendeskConf, setLoading)
      }
    } else {
      delete newConf[name]
    }
    setZendeskConf({ ...newConf })
  }

  const setChanges = (val, name) => {
    const newConf = { ...zendeskConf }
    newConf[name] = val
    if ((name === 'selectedCRMCompany' || name === 'selectedCRMContact') && val !== '' && (zendeskConf.actionName === 'lead' || zendeskConf.actionName === 'deal')) {
      newConf.selectedCRMSources = ''
      getAllCRMSources(newConf, setZendeskConf, setLoading)
    }
    setZendeskConf({ ...newConf })
  }
  return (
    <>
      <br />

      <b className="wdt-200 d-in-b">{__('Select Action:', 'bit-integrations')}</b>
      <select onChange={handleActionInput} name="actionName" value={zendeskConf.actionName} className="btcd-paper-inp w-5">
        <option value="">{__('Select an action', 'bit-integrations')}</option>
        <option value="organization">{__('Create Organization', 'bit-integrations')}</option>
        <option value="contact">{__('Create Contact', 'bit-integrations')}</option>
        <option value="lead">{__('Create Lead', 'bit-integrations')}</option>
        <option value="deal">{__('Create Deal', 'bit-integrations')}</option>
      </select>
      {(loading.CRMCompanies || loading.CRMContacts || loading.CRMSources) && (
        <Loader style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 100,
          transform: 'scale(0.7)',
        }}
        />
      )}
      {(zendeskConf.actionName === 'lead')
        && (
          <>
            <br />
            <br />
            <div className="flx">
              <b className="wdt-200 d-in-b">{__('Select Company:', 'bit-integrations')}</b>

              <MultiSelect
                options={zendeskConf?.CRMCompanies?.map(CRMCompany => ({ label: CRMCompany.name, value: CRMCompany.id }))}
                className="msl-wrp-options dropdown-custom-width"
                defaultValue={zendeskConf?.selectedCRMCompany}
                onChange={val => setChanges(val, 'selectedCRMCompany')}
                disabled={loading.CRMCompanies}
                singleSelect
              />
              <button
                onClick={() => getAllCRMCompanies(zendeskConf, setZendeskConf, setLoading)}
                className="icn-btn sh-sm ml-2 mr-2 tooltip"
                style={{ '--tooltip-txt': `'${__('Refresh companies', 'bit-integrations')}'` }}
                type="button"
                disabled={loading.CRMCompanies}
              >
                &#x21BB;
              </button>
            </div>
          </>
        )}
      {(zendeskConf.actionName === 'deal')
        && (
          <>
            <br />
            <br />
            <div className="flx">
              <b className="wdt-200 d-in-b">{__('Select Contact:', 'bit-integrations')}</b>
              <MultiSelect
                options={zendeskConf?.CRMContacts?.map(CRMContact => ({ label: CRMContact.name, value: CRMContact.id }))}
                className="msl-wrp-options dropdown-custom-width"
                defaultValue={zendeskConf?.selectedCRMContact}
                onChange={val => setChanges(val, 'selectedCRMContact')}
                disabled={loading.CRMContacts}
                singleSelect
              />
              <button
                onClick={() => getAllCRMContacts(zendeskConf, setZendeskConf, setLoading)}
                className="icn-btn sh-sm ml-2 mr-2 tooltip"
                style={{ '--tooltip-txt': `'${__('Refresh contacts', 'bit-integrations')}'` }}
                type="button"
                disabled={loading.CRMContacts}
              >
                &#x21BB;
              </button>
            </div>
          </>
        )}
      {((zendeskConf.actionName === 'lead' || zendeskConf.actionName === 'deal') && (zendeskConf.selectedCRMCompany || zendeskConf.selectedCRMContact))
        && (
          <>
            <br />
            <br />
            <div className="flx">
              <b className="wdt-200 d-in-b">{__('Select Source:', 'bit-integrations')}</b>
              <MultiSelect
                options={zendeskConf?.CRMSources?.map(CRMSource => ({ label: CRMSource.name, value: CRMSource.id }))}
                className="msl-wrp-options dropdown-custom-width"
                defaultValue={zendeskConf?.selectedCRMSources}
                onChange={val => setChanges(val, 'selectedCRMSources')}
                disabled={loading.CRMSources}
                singleSelect
              />
              <button
                onClick={() => getAllCRMSources(zendeskConf, setZendeskConf, setLoading)}
                className="icn-btn sh-sm ml-2 mr-2 tooltip"
                style={{ '--tooltip-txt': `'${__('Refresh Sources', 'bit-integrations')}'` }}
                type="button"
                disabled={loading.CRMSources}
              >
                &#x21BB;
              </button>
            </div>
          </>
        )}
      {(loading.customFields) && (
        <Loader style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 100,
          transform: 'scale(0.7)',
        }}
        />
      )}
      {zendeskConf.actionName && (
        <div>
          <br />
          <div className="mt-5">
            <b className="wdt-100">
              {__('Field Map', 'bit-integrations')}
            </b>
            <button
              onClick={() => getCustomFields(zendeskConf, setZendeskConf, setLoading)}
              className="icn-btn sh-sm ml-2 mr-2 tooltip"
              style={{ '--tooltip-txt': `'${__('Refresh Fields', 'bit-integrations')}'` }}
              type="button"
              disabled={loading.CRMSources}
            >
              &#x21BB;
            </button>
          </div>

          <br />
          <div className="btcd-hr mt-1" />
          <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
            <div className="txt-dp"><b>{__('Form Fields', 'bit-integrations')}</b></div>
            <div className="txt-dp"><b>{__('Zendesk Fields', 'bit-integrations')}</b></div>

          </div>

          {zendeskConf?.field_map.map((itm, i) => (
            <ZendeskFieldMap
              key={`rp-m-${i + 9}`}
              i={i}
              field={itm}
              zendeskConf={zendeskConf}
              formFields={formFields}
              setZendeskConf={setZendeskConf}
              setSnackbar={setSnackbar}
            />
          ))}
          <div className="txt-center btcbi-field-map-button mt-2"><button onClick={() => addFieldMap(zendeskConf.field_map.length, zendeskConf, setZendeskConf, false)} className="icn-btn sh-sm" type="button">+</button></div>
          <br />
          <br />
          <div className="mt-4"><b className="wdt-100">{__('Actions', 'bit-integrations')}</b></div>
          <div className="btcd-hr mt-1" />
          <ZendeskActions
            zendeskConf={zendeskConf}
            setZendeskConf={setZendeskConf}
            formFields={formFields}
            loading={loading}
            setLoading={setLoading}
          />
        </div>
      )}
    </>
  )
}
