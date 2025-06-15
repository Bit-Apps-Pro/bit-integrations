// eslint-disable-next-line import/no-extraneous-dependencies
import { __ } from '@wordpress/i18n'
import { useRecoilValue } from 'recoil'
import { $btcbi } from '../../../GlobalStates'
import TrashIcn from '../../../Icons/TrashIcn'
import { SmartTagField } from '../../../Utils/StaticData/SmartTagField'
import MtInput from '../../Utilities/MtInput'

export default function MailifyFieldMap({ i, formFields, field, mailifyConf, setMailifyConf }) {

  const isRequired = field.required
  const notResquiredField = mailifyConf?.default?.fields && Object.values(mailifyConf?.default?.fields).filter((f => !f.required))
  const btcbi = useRecoilValue($btcbi)
  const { isPro } = btcbi
  const addFieldMap = (indx) => {
    const newConf = { ...mailifyConf }
    newConf.field_map.splice(indx, 0, {})
    setMailifyConf(newConf)
  }

  const delFieldMap = (indx) => {
    const newConf = { ...mailifyConf }
    if (newConf.field_map.length > 1) {
      newConf.field_map.splice(indx, 1)
    }
    setMailifyConf(newConf)
  }

  const handleFieldMapping = (event, indx) => {
    const newConf = { ...mailifyConf }
    newConf.field_map[indx][event.target.name] = event.target.value

    if (event.target.value === 'custom') {
      newConf.field_map[indx].customValue = ''
    }
    setMailifyConf(newConf)
  }

  const handleCustomValue = (event, indx) => {
    const newConf = { ...mailifyConf }
    newConf.field_map[indx].customValue = event.target.value
    setMailifyConf(newConf)
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

        <select className="btcd-paper-inp" name="mailifyField" value={field.mailifyField || ''} onChange={(ev) => handleFieldMapping(ev, i)} disabled={isRequired}>
          <option value="">{__('Select Field', 'bit-integrations')}</option>
          {isRequired ? mailifyConf?.default?.fields && Object.values(mailifyConf.default.fields).map(fld => (
            <option key={`${fld.fieldValue}`} value={fld.fieldValue}>
              {fld.fieldName}
            </option>
          )) : notResquiredField && notResquiredField.map(fld => (
            <option key={`${fld.fieldValue}`} value={fld.fieldValue}>
              {fld.fieldName}
            </option>
          ))}
        </select>
      </div>
      {!isRequired
        && (
          <>
            <button onClick={() => addFieldMap(i)} className="icn-btn sh-sm ml-2" type="button">
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
