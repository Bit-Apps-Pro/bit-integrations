import MultiSelect from 'react-multiple-select-dropdown-lite'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import { addAddressFieldMap, addFieldMap } from '../IntegrationHelpers/MailChimpIntegrationHelpers'
import AddressFieldMap from './AddressFieldMap'
import MailChimpActions from './MailChimpActions'
import { refreshAudience, refreshFields, refreshModules, refreshTags } from './MailChimpCommonFunc'
import MailChimpFieldMap from './MailChimpFieldMap'

export default function MailChimpIntegLayout({
  formID,
  formFields,
  handleInput,
  mailChimpConf,
  setMailChimpConf,
  isLoading,
  setIsLoading,
  setSnackbar,
  a,
  loading,
  setLoading
}) {
  const address = [
    { tag: 'addr1', name: __('Address 1', 'bit-integrations'), required: true },
    { tag: 'addr2', name: __('Address 2', 'bit-integrations'), required: false },
    { tag: 'city', name: __('City', 'bit-integrations'), required: true },
    { tag: 'zip', name: __('Zip', 'bit-integrations'), required: true },
    { tag: 'state', name: __('State', 'bit-integrations'), required: true },
    { tag: 'country', name: __('Country', 'bit-integrations'), required: false }
  ]
  const setTags = (val) => {
    const newConf = { ...mailChimpConf }
    if (val) {
      newConf.tags = val ? val.split(',') : []
    } else {
      delete newConf.tags
    }
    setMailChimpConf({ ...newConf })
  }

  return (
    <>
      <br />
      <b className="wdt-200 d-in-b">{__('Module:', 'bit-integrations')}</b>
      <select
        onChange={handleInput}
        name="module"
        value={mailChimpConf.module}
        className="btcd-paper-inp w-5">
        <option value="">{__('Select Module', 'bit-integrations')}</option>
        {mailChimpConf?.moduleLists &&
          mailChimpConf.moduleLists.map((module, index) => (
            <option key={index} value={module.name}>
              {module.label}
            </option>
          ))}
      </select>
      <button
        onClick={() => refreshModules(setMailChimpConf, setIsLoading, setSnackbar)}
        className="icn-btn sh-sm ml-2 mr-2 tooltip"
        style={{ '--tooltip-txt': '"Refresh module list"' }}
        type="button"
        disabled={isLoading}>
        &#x21BB;
      </button>
      <br />
      <br />
      <b className="wdt-200 d-in-b">{__('Audience List:', 'bit-integrations')}</b>
      <select
        onChange={handleInput}
        name="listId"
        value={mailChimpConf.listId}
        className="btcd-paper-inp w-5">
        <option value="">{__('Select Audience List', 'bit-integrations')}</option>
        {mailChimpConf?.default?.audiencelist &&
          Object.keys(mailChimpConf.default.audiencelist).map((audiencelistName) => (
            <option
              key={audiencelistName}
              value={mailChimpConf.default.audiencelist[audiencelistName].listId}>
              {mailChimpConf.default.audiencelist[audiencelistName].listName}
            </option>
          ))}
      </select>
      <button
        onClick={() =>
          refreshAudience(formID, mailChimpConf, setMailChimpConf, setIsLoading, setSnackbar)
        }
        className="icn-btn sh-sm ml-2 mr-2 tooltip"
        style={{ '--tooltip-txt': '"Refresh Audience list"' }}
        type="button"
        disabled={isLoading}>
        &#x21BB;
      </button>
      <br />
      <br />
      {mailChimpConf?.listId && mailChimpConf?.default?.audienceTags && (
        <div className="d-flx">
          <b style={{ marginTop: '15px' }} className="wdt-200 d-in-b">
            {__('Tags:', 'bit-integrations')}
          </b>
          <MultiSelect
            defaultValue={mailChimpConf?.tags}
            className="btcd-paper-drpdwn w-5"
            options={
              mailChimpConf?.default?.audienceTags &&
              Object.keys(mailChimpConf.default.audienceTags).map((tag) => ({
                label: mailChimpConf.default.audienceTags[tag].tagName,
                value: mailChimpConf.default.audienceTags[tag].tagName
              }))
            }
            onChange={(val) => setTags(val)}
          />
          <button
            onClick={() =>
              refreshTags(formID, mailChimpConf, setMailChimpConf, setSnackbar, loading, setLoading)
            }
            className="icn-btn sh-sm ml-2 mr-2 tooltip"
            style={{ '--tooltip-txt': `'${__('Refresh MailChimp Tags', 'bit-integrations')}'` }}
            type="button"
            disabled={loading?.tags}>
            &#x21BB;
          </button>
        </div>
      )}
      {(isLoading || loading?.tags || loading?.refreshFields) && (
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
      {mailChimpConf.default?.fields?.[mailChimpConf.listId] && !loading?.refreshFields && (
        <>
          <div className="mt-4">
            <b className="wdt-100">{__('Map Fields', 'bit-integrations')}</b>
            <button
              onClick={() =>
                refreshFields(
                  formID,
                  mailChimpConf,
                  setMailChimpConf,
                  setSnackbar,
                  loading,
                  setLoading
                )
              }
              className="icn-btn sh-sm ml-2 mr-2 tooltip"
              style={{ '--tooltip-txt': `'${__('Refresh fields', 'bit-integrations')}'` }}
              type="button"
              disabled={loading?.refreshFields}>
              &#x21BB;
            </button>
          </div>
          <div className="btcd-hr mt-1" />
          <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
            <div className="txt-dp">
              <b>{__('Form Fields', 'bit-integrations')}</b>
            </div>
            <div className="txt-dp">
              <b>{__('Mail Chimp Fields', 'bit-integrations')}</b>
            </div>
          </div>

          {mailChimpConf.field_map.map((itm, i) => (
            <MailChimpFieldMap
              key={`sheet-m-${i + 9}`}
              i={i}
              field={itm}
              mailChimpConf={mailChimpConf}
              formFields={formFields}
              setMailChimpConf={setMailChimpConf}
            />
          ))}
          <div className="txt-center btcbi-field-map-button mt-2">
            <button
              onClick={() =>
                addFieldMap(mailChimpConf.field_map.length, mailChimpConf, setMailChimpConf)
              }
              className="icn-btn sh-sm"
              type="button">
              +
            </button>
          </div>
          <br />
          <br />
          {mailChimpConf.actions?.address && (
            <>
              <div className="mt-4">
                <b className="wdt-100">{__('Address Field Map', 'bit-integrations')}</b>
              </div>
              <div className="btcd-hr mt-1" />
              <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
                <div className="txt-dp">
                  <b>{__('Form Address Fields', 'bit-integrations')}</b>
                </div>
                <div className="txt-dp">
                  <b>{__('Mail Chimp Address Fields', 'bit-integrations')}</b>
                </div>
              </div>
              {mailChimpConf?.address_field?.map((itm, i) => (
                <AddressFieldMap
                  key={`sheet-m-${i + 9}`}
                  i={i}
                  field={itm}
                  mailChimpConf={mailChimpConf}
                  formFields={formFields}
                  setMailChimpConf={setMailChimpConf}
                  addressField={address}
                />
              ))}
              <div className="txt-center btcbi-field-map-button mt-2">
                <button
                  onClick={() =>
                    addAddressFieldMap(
                      mailChimpConf.address_field.length,
                      mailChimpConf,
                      setMailChimpConf
                    )
                  }
                  className="icn-btn sh-sm"
                  type="button">
                  +
                </button>
              </div>
            </>
          )}
          <br />
          <br />
        </>
      )}

      {mailChimpConf.listId && (
        <>
          <div className="mt-4">
            <b className="wdt-100">{__('Utilities', 'bit-integrations')}</b>
          </div>
          <div className="btcd-hr mt-1" />
          <MailChimpActions
            mailChimpConf={mailChimpConf}
            setMailChimpConf={setMailChimpConf}
            formFields={formFields}
            address={address}
          />
        </>
      )}
    </>
  )
}
