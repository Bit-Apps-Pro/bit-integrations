import { useRecoilValue } from 'recoil'
import { __ } from '../../../Utils/i18nwrap'
import MtInput from '../../Utilities/MtInput'
import { addContactFieldMap, addFieldMap, delContactFieldMap, delFieldMap, handleContactFieldMapping, handleCustomValue, handleFieldMapping } from './FreshdeskIntegrationHelpers'
import { SmartTagField } from '../../../Utils/StaticData/SmartTagField'
import { $btcbi } from '../../../GlobalStates'
import { generateContactMappedField } from './FreshdeskCommonFunc'

export default function FreshdeskContactFieldMap({ i, formFields, field, freshdeskConf, setFreshdeskConf }) {
  if (freshdeskConf?.field_map_contact?.length === 1 && field.contactFreshdeskFormField === '') {
    const newConf = { ...freshdeskConf }
    const tmp = generateContactMappedField(newConf)
    newConf.field_map_contact = tmp
    setFreshdeskConf(newConf)
  }

  const requiredFlds = freshdeskConf?.contactFields?.filter(fld => fld.required === true) || []
  const nonRequiredFlds = freshdeskConf?.contactFields?.filter(fld => fld.required === false) || []

  const btcbi = useRecoilValue($btcbi)
  const { isPro } = btcbi

  return (
    <div
      className="flx mt-2 mb-2 btcbi-field-map"
    >
      <div className="pos-rel flx">
        <div className="flx integ-fld-wrp">
          <select className="btcd-paper-inp mr-2" name="formField" value={field.formField || ''} onChange={(ev) => handleContactFieldMapping(ev, i, freshdeskConf, setFreshdeskConf)}>
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

          {field.formField === 'custom' && <MtInput onChange={e => handleCustomValue(e, i, freshdeskConf, setFreshdeskConf)} label={__('Custom Value', 'bit-integrations')} className="mr-2" type="text" value={field.customValue} placeholder={__('Custom Value', 'bit-integrations')} />}

          <select className="btcd-paper-inp" disabled={i < requiredFlds.length} name="contactFreshdeskFormField" value={i < requiredFlds.length ? (requiredFlds[i].key || '') : (field.contactFreshdeskFormField || '')} onChange={(ev) => handleContactFieldMapping(ev, i, freshdeskConf, setFreshdeskConf)}>
            <option value="">{__('Select Field', 'bit-integrations')}</option>
            {
              i < requiredFlds.length ? (
                <option key={requiredFlds[i].key} value={requiredFlds[i].key}>
                  {requiredFlds[i].label}
                </option>
              ) : (
                nonRequiredFlds.map(({ key, label }) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))
              )
            }
          </select>
        </div>
        {
          i >= requiredFlds.length && (
            <>
              <button
                onClick={() => addContactFieldMap(i, freshdeskConf, setFreshdeskConf)}
                className="icn-btn sh-sm ml-2 mr-1"
                type="button"
              >
                +
              </button>
              <button onClick={() => delContactFieldMap(i, freshdeskConf, setFreshdeskConf)} className="icn-btn sh-sm ml-1" type="button" aria-label="btn">
                <span className="btcd-icn icn-trash-2" />
              </button>
            </>
          )
        }
      </div>
    </div>
  )
}
