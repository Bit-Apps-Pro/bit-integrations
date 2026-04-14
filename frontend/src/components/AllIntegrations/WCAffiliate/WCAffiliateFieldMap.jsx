import { useRecoilValue } from 'recoil'
import { $appConfigState } from '../../../GlobalStates'
import { __, sprintf } from '../../../Utils/i18nwrap'
import { SmartTagField } from '../../../Utils/StaticData/SmartTagField'
import TagifyInput from '../../Utilities/TagifyInput'
import {
  addFieldMap,
  delFieldMap,
  handleCustomValue,
  handleFieldMapping
} from '../GlobalIntegrationHelper'

export default function WCAffiliateFieldMap({
  i,
  formFields,
  field,
  wcAffiliateConf,
  setWCAffiliateConf
}) {
  const btcbi = useRecoilValue($appConfigState)
  const { isPro } = btcbi

  const requiredFlds = wcAffiliateConf?.wcAffiliateFields?.filter(fld => fld.required === true) || []
  const nonRequiredFlds = wcAffiliateConf?.wcAffiliateFields?.filter(fld => fld.required === false) || []

  const requiredField = requiredFlds[i]

  return (
    <div className="flx mt-2 mb-2 btcbi-field-map">
      <div className="pos-rel flx">
        <div className="flx integ-fld-wrp">
          <select
            className="btcd-paper-inp mr-2"
            name="formField"
            value={field.formField || ''}
            onChange={ev => handleFieldMapping(ev, i, wcAffiliateConf, setWCAffiliateConf)}>
            <option value="">{__('Select Field', 'bit-integrations')}</option>
            <optgroup label={__('Form Fields', 'bit-integrations')}>
              {formFields?.map(f => (
                <option key={`wcaff-rm-${f.name}`} value={f.name}>
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
                  <option key={`wcaff-rm-${f.name}`} value={f.name}>
                    {f.label}
                  </option>
                ))}
            </optgroup>
          </select>

          {field.formField === 'custom' && (
            <TagifyInput
              onChange={e => handleCustomValue(e, i, wcAffiliateConf, setWCAffiliateConf)}
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
            disabled={Boolean(requiredField)}
            name="wcAffiliateField"
            value={requiredField ? requiredField.key : field.wcAffiliateField || ''}
            onChange={ev => handleFieldMapping(ev, i, wcAffiliateConf, setWCAffiliateConf)}>
            <option value="">{__('Select Field', 'bit-integrations')}</option>
            {requiredField ? (
              <option key={requiredField.key} value={requiredField.key}>
                {requiredField.label}
              </option>
            ) : (
              nonRequiredFlds.map(({ key, label }) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))
            )}
          </select>
        </div>

        {!requiredField && (
          <>
            <button
              onClick={() => addFieldMap(i, wcAffiliateConf, setWCAffiliateConf)}
              className="icn-btn sh-sm ml-2 mr-1"
              type="button">
              +
            </button>
            <button
              onClick={() => delFieldMap(i, wcAffiliateConf, setWCAffiliateConf)}
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
