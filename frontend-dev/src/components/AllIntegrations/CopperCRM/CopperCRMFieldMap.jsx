/* eslint-disable no-console */
import { useRecoilValue } from 'recoil'
import { __ } from '../../../Utils/i18nwrap'
import { addFieldMap, delFieldMap, handleFieldMapping } from './IntegrationHelpers'
import { SmartTagField } from '../../../Utils/StaticData/SmartTagField'
import { $btcbi } from '../../../GlobalStates'
import { generateMappedField } from './CopperCRMCommonFunc'
import CustomField from './CustomField'

export default function CopperCRMFieldMap({ i, formFields, field, coppercrmConf, setCopperCRMConf }) {
  let allFields = []
  let newFields = []
  if (coppercrmConf.actionName === 'company') {
    allFields = coppercrmConf?.companyFields
  } else if (coppercrmConf.actionName === 'person') {
    allFields = coppercrmConf?.personFields
  } else if (coppercrmConf.actionName === 'opportunity') {
    allFields = coppercrmConf?.opportunityFields
  } else if (coppercrmConf.actionName === 'task') {
    allFields = coppercrmConf?.taskFields
  }
  // newFields = [...allFields, ...coppercrmConf?.customFields]
  const requiredFields = allFields.filter(fld => fld.required === true) || []
  const nonRequiredFields = allFields.filter(fld => fld.required === false) || []
  const allNonRequiredFields = coppercrmConf.customFields ? [...nonRequiredFields, ...coppercrmConf?.customFields] : nonRequiredFields

  if (coppercrmConf?.field_map?.length === 1 && field.coppercrmFormField === '') {
    const newConf = { ...coppercrmConf }
    const tmp = generateMappedField(newConf)
    newConf.field_map = tmp
    setCopperCRMConf(newConf)
  }

  const btcbi = useRecoilValue($btcbi)
  const { isPro } = btcbi

  return (
    <div
      className="flx mt-2 mb-2 btcbi-field-map"
    >
      <div className="pos-rel flx">
        <div className="flx integ-fld-wrp">
          <select className="btcd-paper-inp mr-2" name="formField" value={field.formField || ''} onChange={(ev) => handleFieldMapping(ev, i, coppercrmConf, setCopperCRMConf)}>
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
              conf={coppercrmConf}
              setConf={setCopperCRMConf}
              fieldValue="customValue"
              fieldLabel="Custom Value"
              className="mr-2"
            />
          )}

          <select className="btcd-paper-inp" disabled={i < requiredFields.length} name="coppercrmFormField" value={i < requiredFields ? (requiredFields[i].label || '') : (field.coppercrmFormField || '')} onChange={(ev) => handleFieldMapping(ev, i, coppercrmConf, setCopperCRMConf)}>
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
            {(coppercrmConf.actionName === 'company' || coppercrmConf.actionName === 'person' || coppercrmConf.actionName === 'opportunity' || coppercrmConf.actionName === 'task')
              && <option value="customFieldKey">{__('Custom Field', 'bit-integrations')}</option>}
          </select>
          {field.coppercrmFormField === 'customFieldKey'
            && (
              <CustomField
                field={field}
                index={i}
                conf={coppercrmConf}
                setConf={setCopperCRMConf}
                fieldValue="customFieldKey"
                fieldLabel="Custom Field Key"
                className="ml-2"
              />
            )}
        </div>
        {
          i >= requiredFields.length && (
            <>
              <button
                onClick={() => addFieldMap(i, coppercrmConf, setCopperCRMConf)}
                className="icn-btn sh-sm ml-2 mr-1"
                type="button"
              >
                +
              </button>
              <button onClick={() => delFieldMap(i, coppercrmConf, setCopperCRMConf)} className="icn-btn sh-sm ml-1" type="button" aria-label="btn">
                <span className="btcd-icn icn-trash-2" />
              </button>
            </>
          )
        }
      </div>
    </div>
  )
}
