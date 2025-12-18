/* eslint-disable no-console */
import { useRecoilValue } from 'recoil'
import { useMemo } from 'react'
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
  const nonRequiredFields = useMemo(
    () => (fabmanConf?.staticFields ? fabmanConf.staticFields.filter(fld => !fld.required) : []),
    [fabmanConf?.staticFields]
  )
  const customFields = useMemo(
    () => (Array.isArray(fabmanConf.customFields) ? fabmanConf.customFields : []),
    [fabmanConf.customFields]
  )
  const allNonRequiredFields = useMemo(
    () => [...nonRequiredFields, ...customFields],
    [nonRequiredFields, customFields]
  )

  const btcbi = useRecoilValue($btcbi)
  const { isPro } = btcbi

  const isDeleteDisabled = useMemo(
    () => Array.isArray(fabmanConf?.field_map) && fabmanConf.field_map.length <= 1,
    [fabmanConf?.field_map]
  )

  return (
    <div className="flx mt-2 mb-2 btcbi-field-map">
      <div className="pos-rel flx">
        <div className="flx integ-fld-wrp">
          <select
            className="btcd-paper-inp mr-2"
            name="formField"
            value={field.formField || ''}
            onChange={ev => handleFieldMapping(ev, i, fabmanConf, setFabmanConf)}>
            <option value="">{__('Select Field', 'bit-integrations')}</option>
            <optgroup label={__('Form Fields', 'bit-integrations')}>
              {formFields?.map(f => (
                <option key={`ff-rm-${f.name}`} value={f.name}>
                  {f.label}
                </option>
              ))}
            </optgroup>
            <option value="custom">{__('Custom...', 'bit-integrations')}</option>
            {isPro && (
              <optgroup label={__('General Smart Codes', 'bit-integrations')}>
                {SmartTagField?.map(f => (
                  <option key={`ff-rm-${f.name}`} value={f.name}>
                    {f.label}
                  </option>
                ))}
              </optgroup>
            )}
          </select>

          {field.formField === 'custom' && (
            <TagifyInput
              onChange={e => handleCustomValue(e, i, fabmanConf, setFabmanConf)}
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
            onChange={ev => handleFieldMapping(ev, i, fabmanConf, setFabmanConf)}>
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
          </select>
        </div>
        {i >= requiredFields.length && (
          <>
            <button
              onClick={() => addFieldMap(i, fabmanConf, setFabmanConf)}
              className="icn-btn sh-sm ml-2 mr-1"
              type="button">
              +
            </button>
            <div className="pos-rel delete-field-wrapper" style={{ position: 'relative' }}>
              <button
                onClick={() => delFieldMap(i, fabmanConf, setFabmanConf)}
                disabled={isDeleteDisabled}
                className={`icn-btn sh-sm ml-1 ${isDeleteDisabled ? 'btcd-icn-disabled' : ''}`}
                type="button"
                aria-label="Delete field mapping"
                title={
                  isDeleteDisabled
                    ? __('At least one field mapping is required', 'bit-integrations')
                    : __('Delete field mapping', 'bit-integrations')
                }>
                <span className="btcd-icn icn-trash-2" />
              </button>
              {isDeleteDisabled && (
                <div
                  className="delete-tooltip"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(0, 0, 0, 0.9)',
                    color: 'white',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    whiteSpace: 'nowrap',
                    zIndex: 1000,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    maxWidth: '200px'
                  }}>
                  {__('At least one field mapping is required', 'bit-integrations')}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
