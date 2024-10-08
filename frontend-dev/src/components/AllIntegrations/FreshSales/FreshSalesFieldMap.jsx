import { useRecoilValue } from 'recoil'
import { $btcbi } from '../../../GlobalStates'
import { SmartTagField } from '../../../Utils/StaticData/SmartTagField'
import { __ } from '../../../Utils/i18nwrap'
import TagifyInput from '../../Utilities/TagifyInput'
import {
  addFieldMap,
  delFieldMap,
  handleCustomValue,
  handleFieldMapping
} from '../IntegrationHelpers/IntegrationHelpers'

export default function FreshSalesFieldMap({
  i,
  formFields,
  uploadFields,
  field,
  freshSalesConf,
  setFreshSalesConf
}) {
  const module = freshSalesConf.moduleData.module
  const requiredFlds =
    freshSalesConf.default.modules?.[module]?.fields?.filter((fld) => fld.required === true) || []
  const nonRequiredFlds =
    freshSalesConf.default.modules?.[module]?.fields?.filter((fld) => fld.required === false) || []
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
            onChange={(ev) =>
              handleFieldMapping(ev, i, freshSalesConf, setFreshSalesConf, uploadFields)
            }>
            <option value="">{__('Select Field', 'bit-integrations')}</option>
            <optgroup label={__('Form Fields', 'bit-integrations')}>
              {formFields.map((f) => (
                <option key={`ff-zhcrm-${f.name}`} value={f.name}>
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
                  <option key={`ff-zhcrm-${f.name}`} value={f.name}>
                    {f.label}
                  </option>
                ))}
            </optgroup>
          </select>

          {field.formField === 'custom' && (
            <TagifyInput
              onChange={(e) => handleCustomValue(e, i, freshSalesConf, setFreshSalesConf)}
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
            disabled={i < requiredFlds.length}
            name="freshSalesFormField"
            value={i < requiredFlds ? requiredFlds[i].label || '' : field.freshSalesFormField || ''}
            onChange={(ev) =>
              handleFieldMapping(ev, i, freshSalesConf, setFreshSalesConf, uploadFields)
            }>
            <option value="">{__('Select Field', 'bit-integrations')}</option>
            {i < requiredFlds.length ? (
              <option key={requiredFlds[i].key} value={requiredFlds[i].key}>
                {requiredFlds[i].label}
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
        <div className="flx integ-fld-wrp">
          {i >= requiredFlds.length && (
            <>
              <button
                onClick={() => addFieldMap(i, freshSalesConf, setFreshSalesConf, uploadFields)}
                className="icn-btn sh-sm ml-2 mr-1"
                type="button">
                +
              </button>
              <button
                onClick={() => delFieldMap(i, freshSalesConf, setFreshSalesConf, uploadFields)}
                className="icn-btn sh-sm ml-1"
                type="button"
                aria-label="btn">
                <span className="btcd-icn icn-trash-2" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
