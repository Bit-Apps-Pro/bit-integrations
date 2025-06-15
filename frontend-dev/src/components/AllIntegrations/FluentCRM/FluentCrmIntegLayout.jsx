import MultiSelect from 'react-multiple-select-dropdown-lite'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import { addFieldMap } from '../IntegrationHelpers/IntegrationHelpers'
import FluentCrmActions from './FluentCrmActions'
import { refreshCrmList, refreshCrmTag, refreshfluentCrmHeader } from './FluentCrmCommonFunc'
import FluentCrmFieldMap from './FluentCrmFieldMap'

export default function FluentCrmIntegLayout({ formID, formFields, fluentCrmConf, setFluentCrmConf, isLoading, setIsLoading, loading, setLoading, setSnackbar }) {
  const tags = (val) => {
    const newConf = { ...fluentCrmConf }
    if (val) {
      newConf.tags = val ? val.split(',') : []
    } else {
      delete newConf.tags
    }
    setFluentCrmConf({ ...newConf })
  }
  const action = [
    { value: 'add-tag', label: 'Add tag to a user' },
    { value: 'remove-tag', label: 'Remove tag from a user' },
    { value: 'add-user', label: 'Add user to a list' },
    { value: 'remove-user', label: 'Remove user from a list' },
  ]

  const inputHendler = (e) => {
    const newConf = { ...fluentCrmConf }
    newConf.list_id = e.target.value
    setFluentCrmConf({ ...newConf })
  }

  const handleAction = (e) => {
    const newConf = { ...fluentCrmConf }
    const { name, value } = e.target
    delete newConf?.fluentCrmList
    delete newConf?.fluentCrmTags

    if (e.target.value !== '') {
      newConf[name] = value
      refreshfluentCrmHeader(
        newConf,
        setFluentCrmConf,
        setIsLoading,
        setSnackbar
      );

      if (value === 'add-user' || value === 'remove-user') {
        refreshCrmList(formID, newConf, setFluentCrmConf, loading, setLoading, setSnackbar)
      } else {
        refreshCrmTag(formID, newConf, setFluentCrmConf, loading, setLoading, setSnackbar)
      }

    } else {
      delete newConf[name]
    }
    setFluentCrmConf(newConf)
  }

  return (
    <>
      <br />
      <div className="flx">
        <b className="wdt-200 d-in-b">{__('Action:', 'bit-integrations')}</b>
        <select onChange={handleAction} name="actionName" value={fluentCrmConf?.actionName} className="btcd-paper-inp w-5">
          <option value="">{__('Select Action', 'bit-integrations')}</option>
          {
            action.map(({ label, value }) => (
              <option key={label} value={value}>
                {label}
              </option>
            ))
          }
        </select>
      </div>
      <br />
      {(loading.fluentCrmList || loading.fluentCrmTags) && (
        <Loader style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 100,
          transform: 'scale(0.7)',
        }}
        />
      )}
      {(fluentCrmConf?.actionName === 'add-user' || fluentCrmConf?.actionName === 'remove-user') && fluentCrmConf?.fluentCrmList && !loading.fluentCrmList && (
        <div className="flx">
          <b className="wdt-200 d-in-b">{__('Fluent CRM List:', 'bit-integrations')}</b>
          <select onChange={(e) => inputHendler(e)} name="list_id" value={fluentCrmConf.list_id} className="btcd-paper-inp w-5">
            <option value="">{__('Select Fluent CRM list', 'bit-integrations')}</option>
            {
              fluentCrmConf?.fluentCrmList && Object.keys(fluentCrmConf.fluentCrmList).map(fluentCrmListName => (
                <option key={fluentCrmListName} value={fluentCrmConf.fluentCrmList[fluentCrmListName].id}>
                  {fluentCrmConf.fluentCrmList[fluentCrmListName].title}
                </option>
              ))
            }
          </select>
          <button onClick={() => refreshCrmList(formID, fluentCrmConf, setFluentCrmConf, loading, setLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `'${__('Refresh List, Tag & Field', 'bit-integrations')}'` }} type="button" disabled={isLoading}>&#x21BB;</button>
        </div>
      )}
      {fluentCrmConf?.actionName && fluentCrmConf?.actionName !== 'remove-user' && fluentCrmConf?.fluentCrmTags && !loading.fluentCrmTags && (
        <div className="flx mt-5">
          <b className="wdt-200 d-in-b">{__('Fluent CRM Tags: ', 'bit-integrations')}</b>
          <MultiSelect
            defaultValue={fluentCrmConf?.tags}
            className="btcd-paper-drpdwn w-5"
            options={fluentCrmConf?.fluentCrmTags && Object.keys(fluentCrmConf.fluentCrmTags).map(tag => ({ label: fluentCrmConf.fluentCrmTags[tag].title, value: fluentCrmConf.fluentCrmTags[tag].id.toString() }))}
            onChange={val => tags(val)}
          />
          <button onClick={() => refreshCrmTag(formID, fluentCrmConf, setFluentCrmConf, loading, setLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `'${__('Refresh Tag & Field', 'bit-integrations')}'` }} type="button" disabled={isLoading}>&#x21BB;</button>

        </div>
      )}
      {isLoading && (
        <Loader style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 100,
          transform: 'scale(0.7)',
        }}
        />
      )}
      {fluentCrmConf?.actionName && !isLoading &&
        <>
          <div className="mt-4">
            <b className="wdt-100">{__('Map Fields', 'bit-integrations')}</b>
          </div>
          <div className="btcd-hr mt-1" />
          <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
            <div className="txt-dp"><b>{__('Form Fields', 'bit-integrations')}</b></div>
            <div className="txt-dp"><b>{__('Fluent CRM Fields', 'bit-integrations')}</b></div>
          </div>

          {fluentCrmConf.field_map.map((itm, i) => (
            <FluentCrmFieldMap
              key={`fluentcrm-m-${i + 9}`}
              i={i}
              field={itm}
              fluentCrmConf={fluentCrmConf}
              formFields={formFields}
              setFluentCrmConf={setFluentCrmConf}
            />
          ))}
          <div className="txt-center btcbi-field-map-button mt-2" style={{ marginRight: 85 }}><button onClick={() => addFieldMap(fluentCrmConf.field_map.length, fluentCrmConf, setFluentCrmConf)} className="icn-btn sh-sm" type="button">+</button></div>
        </>
      }
      {fluentCrmConf?.actionName === 'add-user' && (
        <>
          <br />
          <div className="mt-4"><b className="wdt-100">{__('Actions', 'bit-integrations')}</b></div>
          <div className="btcd-hr mt-1" />
          <FluentCrmActions
            fluentCrmConf={fluentCrmConf}
            setFluentCrmConf={setFluentCrmConf}
            setIsLoading={setIsLoading}
            setSnackbar={setSnackbar}
          />

        </>
      )}
    </>
  )
}
