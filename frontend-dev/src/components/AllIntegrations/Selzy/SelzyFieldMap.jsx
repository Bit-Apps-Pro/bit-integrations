import { useRecoilValue } from 'recoil'
import { $btcbi } from '../../../GlobalStates'
import { __ } from '../../../Utils/i18nwrap'
import { SmartTagField } from '../../../Utils/StaticData/SmartTagField'
import MtInput from '../../Utilities/MtInput'
import TagifyInput from '../../Utilities/TagifyInput'
import { addFieldMap, delFieldMap, handleFieldMapping } from '../GlobalIntegrationHelper'
import { handleCustomValue } from '../IntegrationHelpers/IntegrationHelpers'
import { generateMappedField } from './SelzyCommonFunc'

function selzyFieldMap({ i, field, formFields, selzyConf, setSelzyConf }) {
  const btcbi = useRecoilValue($btcbi)
  const { isPro } = btcbi

  if (selzyConf?.field_map?.length === 1 && field.selzyFormField === '') {
    const newConf = { ...selzyConf }
    const tmp = generateMappedField(newConf)
    newConf.field_map = tmp
    setSelzyConf(newConf)
  }

  const requiredFields = selzyConf?.selzyFields.filter(fld => fld.required === true) || []

  const nonRequiredStaticFields = selzyConf.method === '1' ? selzyConf?.selzyFields?.filter(fld => fld.required === false) || [] : []
  const nonRequiredCustomFields = selzyConf.method === '1' ? selzyConf?.default?.customFields?.filter(fld => fld.required === false) || [] : []
  const nonRequiredFields = selzyConf.method === '1' ? [...nonRequiredStaticFields, ...nonRequiredCustomFields] || [] : []

  return (
    <div
      className="flx mt-2 mb-2 btcbi-field-map"
    >
      <div className="pos-rel flx">
        <div className="flx integ-fld-wrp">
          <select
            className="btcd-paper-inp mr-2"
            name="formField"
            onChange={(event) => {
              handleFieldMapping(event, i, selzyConf, setSelzyConf)
            }}
            value={field.formField || ''}
          >
            <option value="">{__('Select Field')}</option>
            <optgroup label="Form Fields">
              {
                formFields?.map(f => (
                  <option key={`ff-rm-${f.name}`} value={f.name}>
                    {f.label}
                  </option>
                ))
              }
            </optgroup>
            <option value="custom">{__('Custom...')}</option>
            <optgroup label={`General Smart Codes ${isPro ? '' : '(PRO)'}`}>
              {isPro && SmartTagField?.map(f => (
                <option key={`ff-rm-${f.name}`} value={f.name}>
                  {f.label}
                </option>
              ))}
            </optgroup>

          </select>

          {field.formField === 'custom' && <TagifyInput onChange={e => handleCustomValue(e, i, selzyConf, setSelzyConf)} label={__('Custom Value', 'bit-integrations')} className="mr-2" type="text" value={field.customValue} placeholder={__('Custom Value', 'bit-integrations')} formFields={formFields} />}

          <select
            className="btcd-paper-inp"
            disabled={i < requiredFields.length}
            name="selzyFormField"
            onChange={(event) => {
              handleFieldMapping(event, i, selzyConf, setSelzyConf)
            }}
            value={i < requiredFields.length ? (requiredFields[i].key || '') : (field.selzyFormField || '')}
          >
            <option value="">{__('Select Field')}</option>
            {
              i < requiredFields.length ? (
                <option key={requiredFields[i].key} value={requiredFields[i].key}>
                  {requiredFields[i].label}
                </option>
              ) : (
                nonRequiredFields.map(({ key, label }) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))
              )
            }
          </select>
        </div>
        {selzyConf?.method === '1' && (
          <>
            <button
              onClick={() => addFieldMap(i, selzyConf, setSelzyConf)}
              className="icn-btn sh-sm ml-2 mr-1"
              type="button"
            >
              +
            </button>
            <button onClick={() => delFieldMap(i, selzyConf, setSelzyConf)} className="icn-btn sh-sm ml-1" type="button" aria-label="btn">
              <span className="btcd-icn icn-trash-2" />
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default selzyFieldMap
