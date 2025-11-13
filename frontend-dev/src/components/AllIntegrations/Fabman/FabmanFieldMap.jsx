/* eslint-disable no-console */
import { useRecoilValue } from 'recoil'
import { useMemo, useCallback } from 'react'
import { __, sprintf } from '../../../Utils/i18nwrap'
import { addFieldMap, delFieldMap, handleFieldMapping } from './IntegrationHelpers'
import { SmartTagField } from '../../../Utils/StaticData/SmartTagField'
import { $btcbi } from '../../../GlobalStates'
import { generateMappedField } from './FabmanCommonFunc'
import TagifyInput from '../../Utilities/TagifyInput'
import { handleCustomValue } from '../IntegrationHelpers/IntegrationHelpers'

export default function FabmanFieldMap({ i, formFields, field, fabmanConf, setFabmanConf }) {
  const requiredFields = useMemo(
    () => (fabmanConf?.staticFields ? fabmanConf.staticFields.filter(fld => !!fld.required) : []),
    [fabmanConf?.staticFields]
  )
  const nonRequriedFields = useMemo(
    () => (fabmanConf?.staticFields ? fabmanConf.staticFields.filter(fld => !fld.required) : []),
    [fabmanConf?.staticFields]
  )
  const customFields = useMemo(
    () => (Array.isArray(fabmanConf.customFields) ? fabmanConf.customFields : []),
    [fabmanConf.customFields]
  )
  const allNonrequriedFields = useMemo(
    () => [...nonRequriedFields, ...customFields],
    [nonRequriedFields, customFields]
  )

  const btcbi = useRecoilValue($btcbi)
  const { isPro } = btcbi

  const onFieldMapping = useCallback(
    ev => handleFieldMapping(ev, i, fabmanConf, setFabmanConf),
    [i, fabmanConf, setFabmanConf]
  )
  const onCustomValue = useCallback(
    e => handleCustomValue(e, i, fabmanConf, setFabmanConf),
    [i, fabmanConf, setFabmanConf]
  )
  const onAddFieldMap = useCallback(
    () => addFieldMap(i, fabmanConf, setFabmanConf),
    [i, fabmanConf, setFabmanConf]
  )
  const onDelFieldMap = useCallback(
    () => delFieldMap(i, fabmanConf, setFabmanConf),
    [i, fabmanConf, setFabmanConf]
  )

  return (
    <div className="flx mt-2 mb-2 btcbi-field-map">
      <div className="pos-rel flx">
        <div className="flx integ-fld-wrp">
          <select
            className="btcd-paper-inp mr-2"
            name="formField"
            value={field.formField || ''}
            onChange={onFieldMapping}>
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
              onChange={onCustomValue}
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
            name="fabmanFormField"
            value={i < requiredFields.length ? requiredFields[i].key || '' : field.fabmanFormField || ''}
            onChange={onFieldMapping}>
            <option value="">{__('Select Field', 'bit-integrations')}</option>
            {i < requiredFields.length ? (
              <option key={requiredFields[i].key} value={requiredFields[i].key}>
                {requiredFields[i].label}
              </option>
            ) : (
              allNonrequriedFields.map(({ key, label }) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))
            )}
          </select>
        </div>
        {i >= requiredFields.length && (
          <>
            <button onClick={onAddFieldMap} className="icn-btn sh-sm ml-2 mr-1" type="button">
              +
            </button>
            <button
              onClick={onDelFieldMap}
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
