import { useRecoilValue } from 'recoil'
import { $btcbi } from '../../../GlobalStates'
import { __, sprintf } from '../../../Utils/i18nwrap'
import { SmartTagField } from '../../../Utils/StaticData/SmartTagField'
import TagifyInput from '../../Utilities/TagifyInput'
import { addFieldMap, delFieldMap, handleCustomValue, handleFieldMapping } from './LineCommonFunc'

export default function LineFieldMap({
  i,
  formFields,
  field,
  lineConf,
  setLineConf,
  requiredFields,
  fieldMapKey
}) {
  const btcbi = useRecoilValue($btcbi)
  const { isPro } = btcbi

  const isMessageField = fieldMapKey === 'message_field_map'

  return (
    <div className="flx mt-2 mb-2 btcbi-field-map">
      <div className="pos-rel flx">
        <div className="flx integ-fld-wrp">
          <select
            className="btcd-paper-inp mr-2"
            name="formField"
            value={field.formField || ''}
            onChange={ev => handleFieldMapping(ev, i, lineConf, setLineConf, fieldMapKey)}>
            <option value="">{__('Select Field', 'bit-integrations')}</option>
            <optgroup label={__('Form Fields', 'bit-integrations')}>
              {formFields?.map(f => (
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
                SmartTagField?.map(f => (
                  <option key={`ff-rm-${f.name}`} value={f.name}>
                    {f.label}
                  </option>
                ))}
            </optgroup>
          </select>

          {field.formField === 'custom' && (
            <TagifyInput
              onChange={e => handleCustomValue(e, i, lineConf, setLineConf, fieldMapKey)}
              label={__('Custom Value', 'bit-integrations')}
              className="mr-2"
              type="text"
              value={field.customValue || ''}
              placeholder={
                isMessageField
                  ? __('Enter message template with #field_name#', 'bit-integrations')
                  : __('Custom Value', 'bit-integrations')
              }
              formFields={formFields}
            />
          )}

          <select
            className="btcd-paper-inp"
            disabled={true}
            name="lineFormField"
            value={field.lineFormField || ''}>
            {Array.isArray(requiredFields) &&
              requiredFields.map(({ value, label }, index) => (
                <option key={index} value={value}>
                  {label}
                </option>
              ))}
          </select>
        </div>

        {i >= requiredFields.length && (
          <>
            <button
              onClick={() => delFieldMap(i, lineConf, setLineConf, fieldMapKey)}
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
