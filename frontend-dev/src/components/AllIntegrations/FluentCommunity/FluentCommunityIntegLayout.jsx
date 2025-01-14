import MultiSelect from 'react-multiple-select-dropdown-lite'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import { addFieldMap } from '../IntegrationHelpers/IntegrationHelpers'
import FluentCommunityActions from './FluentCommunityActions'
import { refreshCrmList, refreshCrmTag, refreshfluentCommunityHeader } from './FluentCommunityCommonFunc'
import FluentCommunityFieldMap from './FluentCommunityFieldMap'

export default function FluentCommunityIntegLayout({
  formID,
  formFields,
  fluentCommunityConf,
  setFluentCommunityConf,
  isLoading,
  setIsLoading,
  loading,
  setLoading,
  setSnackbar
}) {
  const tags = (val) => {
    const newConf = { ...fluentCommunityConf }
    if (val) {
      newConf.tags = val ? val.split(',') : []
    } else {
      delete newConf.tags
    }
    setFluentCommunityConf({ ...newConf })
  }
  const action = [
    { value: 'create-space', label: __('Create Space', 'bit-integrations') },
    { value: 'create-course', label: __('Create Course', 'bit-integrations') },
    {
      value: 'create-user-invitation-link',
      label: __('Create User Invitation Link', 'bit-integrations')
    },
    { value: 'remove-user', label: __('Remove user from a list', 'bit-integrations') }
  ]

  const inputHendler = (e) => {
    const newConf = { ...fluentCommunityConf }
    newConf.list_id = e.target.value
    setFluentCommunityConf({ ...newConf })
  }

  const handleAction = (e) => {
    const newConf = { ...fluentCommunityConf }
    const { name, value } = e.target
    delete newConf?.fluentCommunityList
    delete newConf?.fluentCommunityTags

    if (e.target.value !== '') {
      newConf[name] = value
      refreshfluentCommunityHeader(newConf, setFluentCommunityConf, setIsLoading, setSnackbar)

      if (value === 'add-user' || value === 'remove-user') {
        refreshCrmList(formID, newConf, setFluentCommunityConf, loading, setLoading, setSnackbar)
      } else {
        refreshCrmTag(formID, newConf, setFluentCommunityConf, loading, setLoading, setSnackbar)
      }
    } else {
      delete newConf[name]
    }
    setFluentCommunityConf(newConf)
  }

  return (
    <>
      <br />
      <div className="flx">
        <b className="wdt-200 d-in-b">{__('Action:', 'bit-integrations')}</b>
        <select
          onChange={handleAction}
          name="actionName"
          value={fluentCommunityConf?.actionName}
          className="btcd-paper-inp w-5">
          <option value="">{__('Select Action', 'bit-integrations')}</option>
          {action.map(({ label, value }) => (
            <option key={label} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <br />
      {(loading.fluentCommunityList || loading.fluentCommunityTags) && (
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
      {(fluentCommunityConf?.actionName === 'add-user' ||
        fluentCommunityConf?.actionName === 'remove-user') &&
        fluentCommunityConf?.fluentCommunityList &&
        !loading.fluentCommunityList && (
          <div className="flx">
            <b className="wdt-200 d-in-b">{__('Fluent Community List:', 'bit-integrations')}</b>
            <select
              onChange={(e) => inputHendler(e)}
              name="list_id"
              value={fluentCommunityConf.list_id}
              className="btcd-paper-inp w-5">
              <option value="">{__('Select Fluent Community list', 'bit-integrations')}</option>
              {fluentCommunityConf?.fluentCommunityList &&
                Object.keys(fluentCommunityConf.fluentCommunityList).map((fluentCommunityListName) => (
                  <option
                    key={fluentCommunityListName}
                    value={fluentCommunityConf.fluentCommunityList[fluentCommunityListName].id}>
                    {fluentCommunityConf.fluentCommunityList[fluentCommunityListName].title}
                  </option>
                ))}
            </select>
            <button
              onClick={() =>
                refreshCrmList(
                  formID,
                  fluentCommunityConf,
                  setFluentCommunityConf,
                  loading,
                  setLoading,
                  setSnackbar
                )
              }
              className="icn-btn sh-sm ml-2 mr-2 tooltip"
              style={{
                '--tooltip-txt': `'${__('Refresh List, Tag & Field', 'bit-integrations')}'`
              }}
              type="button"
              disabled={isLoading}>
              &#x21BB;
            </button>
          </div>
        )}
      {fluentCommunityConf?.actionName &&
        fluentCommunityConf?.actionName !== 'remove-user' &&
        fluentCommunityConf?.fluentCommunityTags &&
        !loading.fluentCommunityTags && (
          <div className="flx mt-5">
            <b className="wdt-200 d-in-b">{__('Fluent Community Tags:', 'bit-integrations')}</b>
            <MultiSelect
              defaultValue={fluentCommunityConf?.tags}
              className="btcd-paper-drpdwn w-5"
              options={
                fluentCommunityConf?.fluentCommunityTags &&
                Object.keys(fluentCommunityConf.fluentCommunityTags).map((tag) => ({
                  label: fluentCommunityConf.fluentCommunityTags[tag].title,
                  value: fluentCommunityConf.fluentCommunityTags[tag].id.toString()
                }))
              }
              onChange={(val) => tags(val)}
            />
            <button
              onClick={() =>
                refreshCrmTag(
                  formID,
                  fluentCommunityConf,
                  setFluentCommunityConf,
                  loading,
                  setLoading,
                  setSnackbar
                )
              }
              className="icn-btn sh-sm ml-2 mr-2 tooltip"
              style={{ '--tooltip-txt': `'${__('Refresh Tag & Field', 'bit-integrations')}'` }}
              type="button"
              disabled={isLoading}>
              &#x21BB;
            </button>
          </div>
        )}
      {isLoading && (
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
      {fluentCommunityConf?.actionName && !isLoading && (
        <>
          <div className="mt-4">
            <b className="wdt-100">{__('Map Fields', 'bit-integrations')}</b>
          </div>
          <div className="btcd-hr mt-1" />
          <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
            <div className="txt-dp">
              <b>{__('Form Fields', 'bit-integrations')}</b>
            </div>
            <div className="txt-dp">
              <b>{__('Fluent Community Fields', 'bit-integrations')}</b>
            </div>
          </div>

          {fluentCommunityConf.field_map.map((itm, i) => (
            <FluentCommunityFieldMap
              key={`fluentcrm-m-${i + 9}`}
              i={i}
              field={itm}
              fluentCommunityConf={fluentCommunityConf}
              formFields={formFields}
              setFluentCommunityConf={setFluentCommunityConf}
            />
          ))}
          <div className="txt-center btcbi-field-map-button mt-2" style={{ marginRight: 85 }}>
            <button
              onClick={() =>
                addFieldMap(
                  fluentCommunityConf.field_map.length,
                  fluentCommunityConf,
                  setFluentCommunityConf
                )
              }
              className="icn-btn sh-sm"
              type="button">
              +
            </button>
          </div>
        </>
      )}
      {fluentCommunityConf?.actionName === 'add-user' && (
        <>
          <br />
          <div className="mt-4">
            <b className="wdt-100">{__('Utilities', 'bit-integrations')}</b>
          </div>
          <div className="btcd-hr mt-1" />
          <FluentCommunityActions
            fluentCommunityConf={fluentCommunityConf}
            setFluentCommunityConf={setFluentCommunityConf}
            loading={loading}
            setLoading={setLoading}
            setSnackbar={setSnackbar}
          />
        </>
      )}
    </>
  )
}
