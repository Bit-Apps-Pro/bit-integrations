// eslint-disable-next-line import/no-extraneous-dependencies
import { __ } from '@wordpress/i18n'
import { useRecoilValue } from 'recoil'
import { $btcbi } from '../../../GlobalStates'
import TrashIcn from '../../../Icons/TrashIcn'
import { SmartTagField } from '../../../Utils/StaticData/SmartTagField'
import MtInput from '../../Utilities/MtInput'

export default function ZagoMailFieldMap({ i, formFields, field, zagoMailConf, setZagoMailConf }) {

  const isRequired = field.required
  const notResquiredField = zagoMailConf?.default?.fields && Object.values(zagoMailConf?.default?.fields).filter((f => !f.required))
  const btcbi = useRecoilValue($btcbi)
  const { isPro } = btcbi
  const addFieldMap = (indx) => {
    const newConf = { ...zagoMailConf }
    newConf.field_map.splice(indx, 0, {})
    setZagoMailConf(newConf)
  }

  const delFieldMap = (indx) => {
    const newConf = { ...zagoMailConf }
    if (newConf.field_map.length > 1) {
      newConf.field_map.splice(indx, 1)
    }
    setZagoMailConf(newConf)
  }

  const handleFieldMapping = (event, indx) => {
    const newConf = { ...zagoMailConf }
    newConf.field_map[indx][event.target.name] = event.target.value

    if (event.target.value === 'custom') {
      newConf.field_map[indx].customValue = ''
    }
    setZagoMailConf(newConf)
  }

  const handleCustomValue = (event, indx) => {
    const newConf = { ...zagoMailConf }
    newConf.field_map[indx].customValue = event.target.value
    setZagoMailConf(newConf)
  }

  return (
    <div className="flx mt-2 mb-2 btcbi-field-map">
      <div className="flx integ-fld-wrp">
        <select className="btcd-paper-inp mr-2" name="formField" value={field.formField || ''} onChange={(ev) => handleFieldMapping(ev, i)}>
          <option value="">{__('Select Field', 'bit-integrations')}</option>
          <optgroup label="List Fields">
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

        {field.formField === 'custom' && <MtInput onChange={e => handleCustomValue(e, i)} label={__('Custom Value', 'bit-integrations')} className="mr-2" type="text" value={field.customValue} placeholder={__('Custom Value', 'bit-integrations')} />}

        <select className="btcd-paper-inp" name="zagoMailField" value={field.zagoMailField} onChange={(ev) => handleFieldMapping(ev, i)} disabled={isRequired}>
          <option value="">{__('Select Field', 'bit-integrations')}</option>
          {isRequired ? zagoMailConf?.default?.fields && Object.values(zagoMailConf.default.fields).map(fld => (
            <option key={`${fld.fieldId}-1`} value={fld.fieldId}>
              {fld.fieldName}
            </option>
          )) : notResquiredField && notResquiredField.map(fld => (
            <option key={`${fld.fieldId}-1`} value={fld.fieldId}>
              {fld.fieldName}
            </option>
          ))}
        </select>
      </div>
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
