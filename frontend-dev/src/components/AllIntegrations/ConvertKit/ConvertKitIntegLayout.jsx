// eslint-disable-next-line import/no-extraneous-dependencies
import { __ } from '@wordpress/i18n'
import { useEffect } from 'react'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import Loader from '../../Loaders/Loader'
import { addFieldMap } from '../IntegrationHelpers/IntegrationHelpers'
import ConvertKitActions from './ConvertKitActions'
import { refreshConvertKitHeader, refreshConvertKitForm, refreshConvertKitTags } from './ConvertKitCommonFunc'
import ConvertKitFieldMap from './ConvertKitFieldMap'

export default function ConvertKitIntegLayout({ formID, formFields, convertKitConf, setConvertKitConf, isLoading, setIsLoading, setSnackbar }) {

  const setTags = (val) => {
    const newConf = { ...convertKitConf }
    if (val) {
      newConf.tagIds = val ? val.split(',') : []
    } else {
      delete newConf.tagIds
    }
    setConvertKitConf({ ...newConf })
  }

  const handleInput = (e) => {
    const formid = e.target.value
    const newConf = { ...convertKitConf }
    if (formid) {
      newConf.formId = formid
    } else {
      delete newConf.formId
    }
    refreshConvertKitHeader(newConf, setConvertKitConf, setIsLoading, setSnackbar)
  }

  const convertKitForms = convertKitConf?.default?.convertKitForms

  useEffect(() => {
    convertKitForms && refreshConvertKitTags(convertKitConf, setConvertKitConf, setIsLoading, setSnackbar)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [convertKitForms])

  return (
    <>
      <br />
      <b className="wdt-200 d-in-b">{__('Form:', 'bit-integrations')}</b>
      <select value={convertKitConf?.formId} name="formId" id="" className="btcd-paper-inp w-5" onChange={handleInput}>
        <option value="">{__('Select Form', 'bit-integrations')}</option>
        {
          convertKitConf?.default?.convertKitForms && Object.keys(convertKitConf.default.convertKitForms).map(formname => (
            <option key={`${formname + 1}`} value={convertKitConf.default.convertKitForms[formname].formId}>
              {convertKitConf.default.convertKitForms[formname].formName}
            </option>
          ))
        }
      </select>
      <button onClick={() => refreshConvertKitForm(convertKitConf, setConvertKitConf, setIsLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': '"Refresh ConvertKit form"' }} type="button" disabled={isLoading}>&#x21BB;</button>
      <br />
      <br />
      <div className="d-flx">
        <b style={{ marginTop: '15px' }} className="wdt-200 d-in-b">{__('Tags: ', 'bit-integrations')}</b>
        <MultiSelect
          defaultValue={convertKitConf?.tagIds?.toString()}
          className="btcd-paper-drpdwn w-5"
          options={convertKitConf?.default?.convertKitTags && Object.keys(convertKitConf.default.convertKitTags).map(tag => ({ label: convertKitConf.default.convertKitTags[tag].tagName, value: convertKitConf.default.convertKitTags[tag].tagId.toString() }))}
          onChange={val => setTags(val)}
        />
        <button onClick={() => refreshConvertKitTags(convertKitConf, setConvertKitConf, setIsLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `'${__('Refresh ConvertKit Tags', 'bit-integrations')}'` }} type="button" disabled={isLoading}>&#x21BB;</button>
      </div>
      <br />
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

      <div className="mt-4">
        <b className="wdt-100">{__('Map Fields', 'bit-integrations')}</b>
        <button onClick={() => refreshConvertKitHeader(convertKitConf, setConvertKitConf, setIsLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `'${__('Refresh ConvertKit Field', 'bit-integrations')}'` }} type="button" disabled={isLoading}>&#x21BB;</button>
      </div>
      {

        (convertKitConf?.formId || convertKitConf?.default?.fields) && (
          <>
            <div className="btcd-hr mt-1" />
            <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
              <div className="txt-dp"><b>{__('Form Fields', 'bit-integrations')}</b></div>
              <div className="txt-dp"><b>{__('ConvertKit Fields', 'bit-integrations')}</b></div>
            </div>

            {convertKitConf.field_map.map((itm, i) => (
              <ConvertKitFieldMap
                key={`ConvertKit-m-${i + 9}`}
                i={i}
                field={itm}
                convertKitConf={convertKitConf}
                formFields={formFields}
                setConvertKitConf={setConvertKitConf}
              />
            ))}
            <div className="txt-center btcbi-field-map-button mt-2"><button onClick={() => addFieldMap(convertKitConf.field_map.length, convertKitConf, setConvertKitConf)} className="icn-btn sh-sm" type="button">+</button></div>
            <br />
            <br />
            <div className="mt-4"><b className="wdt-100">{__('Actions', 'bit-integrations')}</b></div>
            <div className="btcd-hr mt-1" />
            <ConvertKitActions
              convertKitConf={convertKitConf}
              setConvertKitConf={setConvertKitConf}
            />
          </>
        )
      }
    </>
  )
}
