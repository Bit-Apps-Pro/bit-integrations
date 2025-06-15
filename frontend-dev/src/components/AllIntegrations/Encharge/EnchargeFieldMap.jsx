import { useRecoilValue } from 'recoil'
import { $btcbi } from '../../../GlobalStates'
import TrashIcn from '../../../Icons/TrashIcn'
import { __ } from '../../../Utils/i18nwrap'
import { SmartTagField } from '../../../Utils/StaticData/SmartTagField'
import MtInput from '../../Utilities/MtInput'
import TagifyInput from '../../Utilities/TagifyInput'
import { handleCustomValue } from '../IntegrationHelpers/IntegrationHelpers'

export default function EnchargeFieldMap({ i, formFields, field, enchargeConf, setEnchargeConf }) {
  const isRequired = field.required
  const notResquiredField = enchargeConf?.default?.fields && Object.values(enchargeConf?.default?.fields).filter((f => !f.required))
  const addFieldMap = (indx) => {
    const newConf = { ...enchargeConf }
    newConf.field_map.splice(indx, 0, {})
    setEnchargeConf(newConf)
  }

  const delFieldMap = (indx) => {
    const newConf = { ...enchargeConf }
    if (newConf.field_map.length > 1) {
      newConf.field_map.splice(indx, 1)
    }
    setEnchargeConf(newConf)
  }

  const handleFieldMapping = (event, indx) => {
    const newConf = { ...enchargeConf }
    newConf.field_map[indx][event.target.name] = event.target.value

    if (event.target.value === 'custom') {
      newConf.field_map[indx].customValue = ''
    }
    setEnchargeConf(newConf)
  }

  const btcbi = useRecoilValue($btcbi)
  const { isPro } = btcbi

  return (
    <div
      className={isRequired ? 'mt-2 mr-1 flx w-9' : 'flx mt-2 mb-2 btcbi-field-map'}
    >
      <select className="btcd-paper-inp mr-2" name="formField" value={field.formField || ''} onChange={(ev) => handleFieldMapping(ev, i)}>
        <optgroup label="Form Fields">
          <option value="">{__('Select Field', 'bit-integrations')}</option>
          {
            formFields.map(f => f.type !== 'file' && <option key={`ff-zhcrm-${f.name}`} value={f.name}>{f.label}</option>)
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

      {field.formField === 'custom' && <TagifyInput onChange={e => handleCustomValue(e, i, enchargeConf, setEnchargeConf)} label={__('Custom Value', 'bit-integrations')} className="mr-2" type="text" value={field.customValue} placeholder={__('Custom Value', 'bit-integrations')} formFields={formFields} />}

      <select className="btcd-paper-inp" name="enChargeFields" value={field.enChargeFields} onChange={(ev) => handleFieldMapping(ev, i)} disabled={isRequired}>
        <option value="">{__('Select Field', 'bit-integrations')}</option>
        {isRequired ? enchargeConf?.default?.fields && Object.values(enchargeConf.default.fields).map(fld => (
          <option key={`${fld.fieldId}-1`} value={fld.fieldId}>
            {fld.fieldName}
          </option>
        )) : notResquiredField && notResquiredField.map(fld => (
          <option key={`${fld.fieldId}-1`} value={fld.fieldId}>
            {fld.fieldName}
          </option>
        ))}
      </select>
      {!isRequired
        && (
          <>
            <button
              onClick={() => addFieldMap(i)}
              className="icn-btn sh-sm ml-2"
              type="button"
            >
              +
            </button>
            <button onClick={() => delFieldMap(i)} className="icn-btn sh-sm ml-2" type="button" aria-label="btn">
              <TrashIcn />
            </button>
          </>
        )}
    </div>
  )
}
