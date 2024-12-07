// eslint-disable-next-line import/no-extraneous-dependencies
import { __ } from '../../../Utils/i18nwrap'
import { useEffect } from 'react'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import Loader from '../../Loaders/Loader'
import { addFieldMap } from '../IntegrationHelpers/IntegrationHelpers'
import ConvertKitActions from './ConvertKitActions'
import {
  refreshConvertKitHeader,
  refreshConvertKitForm,
  refreshConvertKitTags
} from './ConvertKitCommonFunc'
import ConvertKitFieldMap from './ConvertKitFieldMap'
import { useRecoilValue } from 'recoil'
import { $btcbi } from '../../../GlobalStates'
import { checkIsPro, getProLabel } from '../../Utilities/ProUtilHelpers'
import { create } from 'mutative'

export default function ConvertKitIntegLayout({
  formID,
  formFields,
  convertKitConf,
  setConvertKitConf,
  isLoading,
  setIsLoading,
  setSnackbar
}) {
  const setTags = (val) => {
    const newConf = { ...convertKitConf }
    if (val) {
      newConf.tagIds = val ? val.split(',') : []
    } else {
      delete newConf.tagIds
    }
    setConvertKitConf({ ...newConf })
  }

  const handleInput = (val, name) => {
    const newConf = { ...convertKitConf }
    if (val) {
      newConf[name] = val
    } else {
      delete newConf[name]
    }

    setConvertKitConf({ ...newConf })

    if (name === 'module') {
      refreshConvertKitHeader(newConf, setConvertKitConf, setIsLoading, setSnackbar)
      refreshConvertKitTags(convertKitConf, setConvertKitConf, setIsLoading, setSnackbar)
    }
    if (name === 'module' && val === 'add_subscriber_to_a_form') {
      refreshConvertKitForm(convertKitConf, setConvertKitConf, setIsLoading, setSnackbar)
    }
  }

  return (
    <>
      <br />
      <div className="d-flx">
        <b style={{ marginTop: '15px' }} className="wdt-200 d-in-b">
          {__('Select Module:', 'bit-integrations')}
        </b>
        <MultiSelect
          defaultValue={convertKitConf?.module}
          className="btcd-paper-drpdwn w-5"
          options={[
            { label: "Add subscriber to a form", value: "add_subscriber_to_a_form", },
            { label: "Update a subscriber", value: "update_a_subscriber", },
            { label: "Add tags to a subscriber", value: "add_tags_to_a_subscriber", },
            { label: "Remove tags to a subscriber", value: "remove_tags_to_a_subscriber", },
          ]}
          onChange={(val) => handleInput(val, 'module')}
          singleSelect
          selectOnClose
        />
      </div>

      {(!convertKitConf?.module || convertKitConf?.module === 'add_subscriber_to_a_form') &&
        <>
          <br />
          <b className="wdt-200 d-in-b">{__('Form:', 'bit-integrations')}</b>
          <select
            value={convertKitConf?.formId}
            name="formId"
            id=""
            className="btcd-paper-inp w-5"
            onChange={(e) => handleInput(e.target.value, 'formId')}>
            <option value="">{__('Select Form', 'bit-integrations')}</option>
            {convertKitConf?.default?.convertKitForms &&
              Object.keys(convertKitConf.default.convertKitForms).map((formname) => (
                <option
                  key={`${formname + 1}`}
                  value={convertKitConf.default.convertKitForms[formname].formId}>
                  {convertKitConf.default.convertKitForms[formname].formName}
                </option>
              ))}
          </select>
          <button
            onClick={() =>
              refreshConvertKitForm(convertKitConf, setConvertKitConf, setIsLoading, setSnackbar)
            }
            className="icn-btn sh-sm ml-2 mr-2 tooltip"
            style={{ '--tooltip-txt': '"Refresh ConvertKit form"' }}
            type="button"
            disabled={isLoading}>
            &#x21BB;
          </button>
        </>
      }
      <br />
      <br />
      <div className="d-flx">
        <b style={{ marginTop: '15px' }} className="wdt-200 d-in-b">
          {__('Tags:', 'bit-integrations')}
        </b>
        <MultiSelect
          defaultValue={convertKitConf?.tagIds?.toString()}
          className="btcd-paper-drpdwn w-5"
          options={
            convertKitConf?.default?.convertKitTags &&
            Object.keys(convertKitConf.default.convertKitTags).map((tag) => ({
              label: convertKitConf.default.convertKitTags[tag].tagName,
              value: convertKitConf.default.convertKitTags[tag].tagId.toString()
            }))
          }
          onChange={(val) => setTags(val)}
        />
        <button
          onClick={() =>
            refreshConvertKitTags(convertKitConf, setConvertKitConf, setIsLoading, setSnackbar)
          }
          className="icn-btn sh-sm ml-2 mr-2 tooltip"
          style={{
            '--tooltip-txt': `'${sprintf(__('Refresh %s Tags', 'bit-integrations'), 'Kit(ConvertKit)')}'`
          }}
          type="button"
          disabled={isLoading}>
          &#x21BB;
        </button>
      </div>
      <br />
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

      <div className="mt-4">
        <b className="wdt-100">{__('Map Fields', 'bit-integrations')}</b>
        <button
          onClick={() =>
            refreshConvertKitHeader(convertKitConf, setConvertKitConf, setIsLoading, setSnackbar)
          }
          className="icn-btn sh-sm ml-2 mr-2 tooltip"
          style={{
            '--tooltip-txt': `'${sprintf(__('Refresh %s Field', 'bit-integrations'), 'Kit(ConvertKit)')}'`
          }}
          type="button"
          disabled={isLoading}>
          &#x21BB;
        </button>
      </div>
      {(convertKitConf?.formId || convertKitConf?.default?.fields) && (
        <>
          <div className="btcd-hr mt-1" />
          <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
            <div className="txt-dp">
              <b>{__('Form Fields', 'bit-integrations')}</b>
            </div>
            <div className="txt-dp">
              <b>{sprintf(__('%s Fields', 'bit-integrations'), 'Kit(ConvertKit)')}</b>
            </div>
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
          {convertKitConf?.default?.fields && Object.keys(convertKitConf.default.fields)?.length > 1 &&
            <div className="txt-center btcbi-field-map-button mt-2">
              <button
                onClick={() =>
                  addFieldMap(convertKitConf.field_map.length, convertKitConf, setConvertKitConf)
                }
                className="icn-btn sh-sm"
                type="button">
                +
              </button>
            </div>
          }
          <br />
          <br />
          <div className="mt-4">
            <b className="wdt-100">{__('Utilities', 'bit-integrations')}</b>
          </div>
          <div className="btcd-hr mt-1" />
          <ConvertKitActions
            convertKitConf={convertKitConf}
            setConvertKitConf={setConvertKitConf}
          />
        </>
      )}
    </>
  )
}
