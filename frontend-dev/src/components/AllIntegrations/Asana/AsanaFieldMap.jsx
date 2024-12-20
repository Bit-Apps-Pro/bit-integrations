/* eslint-disable no-console */
import { useRecoilValue } from 'recoil'
import { __ } from '../../../Utils/i18nwrap'
import { addFieldMap, delFieldMap, handleFieldMapping } from './IntegrationHelpers'
import { SmartTagField } from '../../../Utils/StaticData/SmartTagField'
import { $btcbi } from '../../../GlobalStates'
import { generateMappedField } from './AsanaCommonFunc'
import CustomField from './CustomField'
import TagifyInput from '../../Utilities/TagifyInput'
import { handleCustomValue } from '../IntegrationHelpers/IntegrationHelpers'

export default function AsanaFieldMap({ i, formFields, field, asanaConf, setAsanaConf }) {
  let allFields = []
  let newFields = []
  if (asanaConf.actionName === 'task') {
    allFields = asanaConf?.taskFields
  }
  // newFields = [...allFields, ...asanaConf?.customFields]
  const requiredFields = allFields.filter((fld) => fld.required === true) || []
  const nonRequiredFields = allFields.filter((fld) => fld.required === false) || []
  const allNonRequiredFields = [...nonRequiredFields, ...(asanaConf?.customFields || [])]

  if (asanaConf?.field_map?.length === 1 && field.asanaFormField === '') {
    const newConf = { ...asanaConf }
    const tmp = generateMappedField(newConf)
    newConf.field_map = tmp
    setAsanaConf(newConf)
  }

  const btcbi = useRecoilValue($btcbi)
  const { isPro } = btcbi

  return (
    <div className="flx mt-2 mb-2 btcbi-field-map">
      <div className="pos-rel flx">
        <div className="flx integ-fld-wrp">
          <select
            className="btcd-paper-inp mr-2"
            name="formField"
            value={field.formField || ''}
            onChange={(ev) => handleFieldMapping(ev, i, asanaConf, setAsanaConf)}>
            <option value="">{__('Select Field', 'bit-integrations')}</option>
            <optgroup label={__('Form Fields', 'bit-integrations')}>
              {formFields?.map((f) => (
                <option key={`ff-rm-${f.name}`} value={f.name}>
                  {f.label}
                </option>
              ))}
            </optgroup>
            <option value="custom">{__('Custom...', 'bit-integrations')}</option>
            <optgroup
              label={sprintf(
                __('General Smart Codes %s', 'bit-integrations'),
                isPro ? '' : `(${__('Pro', 'bit-integrations')})`
              )}>
              {isPro &&
                SmartTagField?.map((f) => (
                  <option key={`ff-rm-${f.name}`} value={f.name}>
                    {f.label}
                  </option>
                ))}
            </optgroup>
          </select>

          {field.formField === 'custom' && (
            <TagifyInput
              onChange={(e) => handleCustomValue(e, i, asanaConf, setAsanaConf)}
              label={__('Custom Value', 'bit-integrations')}
              className="mr-2"
              type="text"
              value={field.customValue}
              placeholder={__('Custom Value', 'bit-integrations')}
              formFields={formFields}
            />
          )}

          <select
            className="btcd-paper-inp"
            disabled={i < requiredFields.length}
            name="asanaFormField"
            value={i < requiredFields ? requiredFields[i].label || '' : field.asanaFormField || ''}
            onChange={(ev) => handleFieldMapping(ev, i, asanaConf, setAsanaConf)}>
            <option value="">{__('Select Field', 'bit-integrations')}</option>
            {i < requiredFields.length ? (
              <option key={requiredFields[i].key} value={requiredFields[i].key}>
                {requiredFields[i].label}
              </option>
            ) : (
              allNonRequiredFields.map(({ key, label }) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))
            )}
            {asanaConf.actionName === 'task' && (
              <option value="customFieldKey">{__('Custom Field', 'bit-integrations')}</option>
            )}
          </select>
          {field.asanaFormField === 'customFieldKey' && (
            <CustomField
              field={field}
              index={i}
              conf={asanaConf}
              setConf={setAsanaConf}
              fieldValue="customFieldKey"
              fieldLabel="Custom Field Key"
              className="ml-2"
            />
          )}
        </div>
        {i >= requiredFields.length && (
          <>
            <button
              onClick={() => addFieldMap(i, asanaConf, setAsanaConf)}
              className="icn-btn sh-sm ml-2 mr-1"
              type="button">
              +
            </button>
            <button
              onClick={() => delFieldMap(i, asanaConf, setAsanaConf)}
              className="icn-btn sh-sm ml-1"
              type="button"
              aria-label="btn">
              <span className="btcd-icn icn-trash-2" />
            </button>
          </>
        )}
      </div>
    </div>
  )
}
