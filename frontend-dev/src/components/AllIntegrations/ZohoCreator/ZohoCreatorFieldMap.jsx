import { useRecoilValue } from 'recoil'
import { $btcbi } from '../../../GlobalStates'
import TrashIcn from '../../../Icons/TrashIcn'
import { __ } from '../../../Utils/i18nwrap'
import { SmartTagField } from '../../../Utils/StaticData/SmartTagField'
import MtInput from '../../Utilities/MtInput'
import TagifyInput from '../../Utilities/TagifyInput'
import { addFieldMap, delFieldMap, handleCustomValue, handleFieldMapping } from '../IntegrationHelpers/IntegrationHelpers'

export default function ZohoCreatorFieldMap({ i, formFields, uploadFields, field, creatorConf, setCreatorConf }) {
  const { applicationId, formId } = creatorConf
  let isNotRequired

  const btcbi = useRecoilValue($btcbi)
  const { isPro } = btcbi

  if (uploadFields) isNotRequired = field.zohoFormField === '' || creatorConf.default?.fields?.[applicationId]?.[formId]?.requiredFileUploadFields?.indexOf(field.zohoFormField) === -1
  else isNotRequired = field.zohoFormField === '' || creatorConf.default?.fields?.[applicationId]?.[formId]?.required?.indexOf(field.zohoFormField) === -1

  return (
    <div
      className="flx mt-2 mb-2 btcbi-field-map"
    >
      <div className="flx integ-fld-wrp">
        <select className="btcd-paper-inp mr-2" name="formField" value={field.formField || ''} onChange={(ev) => handleFieldMapping(ev, i, creatorConf, setCreatorConf, uploadFields)}>
          <option value="">{__('Select Field', 'bit-integrations')}</option>
          <optgroup label="Form Fields">
            {
              uploadFields ? formFields.map(f => f.type === 'file' && <option key={`ff-zhcrm-${f.name}`} value={f.name}>{f.label}</option>) : formFields.map(f => f.type !== 'file' && <option key={`ff-zhcrm-${f.name}`} value={f.name}>{f.label}</option>)
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

        {field.formField === 'custom' && <TagifyInput onChange={e => handleCustomValue(e, i, creatorConf, setCreatorConf)} label={__('Custom Value', 'bit-integrations')} className="mr-2" type="text" value={field.customValue} placeholder={__('Custom Value', 'bit-integrations')} formFields={formFields} />}

        <select className="btcd-paper-inp" name="zohoFormField" value={field.zohoFormField || ''} disabled={!isNotRequired} onChange={(ev) => handleFieldMapping(ev, i, creatorConf, setCreatorConf, uploadFields)}>
          <option value="">{__('Select Field', 'bit-integrations')}</option>
          {
            uploadFields ? creatorConf.default?.fields?.[applicationId]?.[formId]?.fileUploadFields && Object.values(creatorConf.default.fields[applicationId][formId].fileUploadFields).map(apiField => (
              isNotRequired
                ? apiField.required === false && (
                  <option key={apiField.displayLabel} value={apiField.apiName}>
                    {apiField.displayLabel}
                  </option>
                )
                : (
                  <option key={apiField.displayLabel} value={apiField.apiName}>
                    {apiField.displayLabel}
                  </option>
                )
            ))
              : creatorConf.default?.fields?.[applicationId]?.[formId]?.fields && Object.values(creatorConf.default.fields[applicationId][formId].fields).map(apiField => (
                isNotRequired
                  ? apiField.required === false && (
                    <option key={apiField.displayLabel} value={apiField.apiName}>
                      {apiField.displayLabel}
                    </option>
                  )
                  : (
                    <option key={apiField.displayLabel} value={apiField.apiName}>
                      {apiField.displayLabel}
                    </option>
                  )
              ))
          }
        </select>
      </div>

      {
        isNotRequired && (
          <>
            <button
              onClick={() => addFieldMap(i, creatorConf, setCreatorConf, uploadFields)}
              className="icn-btn sh-sm ml-2 mr-1"
              type="button"
            >
              +
            </button>
            <button onClick={() => delFieldMap(i, creatorConf, setCreatorConf, uploadFields)} className="icn-btn sh-sm ml-1" type="button" aria-label="btn">
              <TrashIcn />
            </button>
          </>
        )
      }
    </div>
  )
}
