/* eslint-disable no-console */
import { useRecoilValue } from 'recoil'
import { $btcbi } from '../../../GlobalStates'
import { SmartTagField } from '../../../Utils/StaticData/SmartTagField'
import { __ } from '../../../Utils/i18nwrap'
import CustomField from './CustomField'
import { addFieldMap, delFieldMap, handleFieldMapping } from './IntegrationHelpers'

export default function CompanyHubFieldMap({ i, formFields, field, companyHubConf, setCompanyHubConf }) {
  let allFields = []
  if (companyHubConf.actionName === 'contact') {
    allFields = companyHubConf?.contactFields
  } else if (companyHubConf.actionName === 'company') {
    allFields = companyHubConf?.companyFields
  } else if (companyHubConf.actionName === 'deal') {
    allFields = companyHubConf?.dealFields
  }

  const requiredFields = allFields.filter(fld => fld.required === true) || []
  const allNonRequiredFields = allFields.filter(fld => fld.required === false) || []

  const btcbi = useRecoilValue($btcbi)
  const { isPro } = btcbi

  return (
    <div
      className="flx mt-2 mb-2 btcbi-field-map"
    >
      <div className="pos-rel flx">
        <div className="flx integ-fld-wrp">
          <select className="btcd-paper-inp mr-2" name="formField" value={field.formField || ''} onChange={(ev) => handleFieldMapping(ev, i, companyHubConf, setCompanyHubConf)}>
            <option value="">{__('Select Field', 'bit-integrations')}</option>
            <optgroup label="Form Fields">
              {
                formFields?.map(f => (
                  <option key={`ff-rm-${f.name}`} value={f.name}>
                    {f.label}
                  </option>
                ))
              }
            </optgroup>
            <option value="custom">{__('Custom...', 'bit-integrations')}</option>
            <optgroup label={`General Smart Codes ${isPro ? '' : '(PRO)'}`}>
              {isPro && SmartTagField?.map(f => (
                <option key={`ff-rm-${f.name}`} value={f.name}>
                  {f.label}
                </option>
              ))}
            </optgroup>
          </select>

          {field.formField === 'custom' && (
            <CustomField
              field={field}
              index={i}
              conf={companyHubConf}
              setConf={setCompanyHubConf}
              fieldValue="customValue"
              fieldLabel="Custom Value"
              className="mr-2"
            />
          )}

          <select className="btcd-paper-inp" disabled={i < requiredFields.length} name="companyHubFormField" value={i < requiredFields.length ? (requiredFields[i].key || '') : (field.companyHubFormField || '')} onChange={(ev) => handleFieldMapping(ev, i, companyHubConf, setCompanyHubConf)}>
            <option value="">{__('Select Field', 'bit-integrations')}</option>
            {
              i < requiredFields.length ? (
                <option key={requiredFields[i].key} value={requiredFields[i].key}>
                  {requiredFields[i].label}
                </option>
              ) : (
                allNonRequiredFields.map(({ key, label }) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))
              )
            }
          </select>
        </div>
        {
          i >= requiredFields.length && (
            <>
              <button
                onClick={() => addFieldMap(i, companyHubConf, setCompanyHubConf)}
                className="icn-btn sh-sm ml-2 mr-1"
                type="button"
              >
                +
              </button>
              <button onClick={() => delFieldMap(i, companyHubConf, setCompanyHubConf)} className="icn-btn sh-sm ml-1" type="button" aria-label="btn">
                <span className="btcd-icn icn-trash-2" />
              </button>
            </>
          )
        }
      </div>
    </div>
  )
}

