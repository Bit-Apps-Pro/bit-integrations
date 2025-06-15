import { useRecoilValue } from 'recoil'
import { $btcbi } from '../../../GlobalStates'
import TrashIcn from '../../../Icons/TrashIcn'
import { __ } from '../../../Utils/i18nwrap'
import { SmartTagField } from '../../../Utils/StaticData/SmartTagField'
import { handleCustomValue } from '../IntegrationHelpers/IntegrationHelpers'
import MtInput from '../../Utilities/MtInput'
import TagifyInput from '../../Utilities/TagifyInput'


export default function AutonamiFieldMap({ i, formFields, field, autonamiConf, setAutonamiConf }) {
  const isRequired = field.required
  const notResquiredField = autonamiConf?.default?.fields && Object.values(autonamiConf?.default?.fields).filter((f => !f.required))
  const btcbi = useRecoilValue($btcbi)
  const { isPro } = btcbi
  const addFieldMap = (indx) => {
    const newConf = { ...autonamiConf }
    newConf.field_map.splice(indx, 0, {})
    setAutonamiConf(newConf)
  }

  const delFieldMap = (indx) => {
    const newConf = { ...autonamiConf }
    if (newConf.field_map.length > 1) {
      newConf.field_map.splice(indx, 1)
    }
    setAutonamiConf(newConf)
  }

  const handleFieldMapping = (event, indx) => {
    const newConf = { ...autonamiConf }
    newConf.field_map[indx][event.target.name] = event.target.value

    if (event.target.value === 'custom') {
      newConf.field_map[indx].customValue = ''
    }
    setAutonamiConf(newConf)
  }

  return (
    <div className="flx mt-2 mb-2 btcbi-field-map">
      <div className="flx integ-fld-wrp">
        <select className="btcd-paper-inp mr-2" name="formField" value={field.formField || ''} onChange={(ev) => handleFieldMapping(ev, i)}>
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

        {field.formField === 'custom' && <TagifyInput onChange={e => handleCustomValue(e, i, autonamiConf, setAutonamiConf)} label={__('Custom Value', 'bit-integrations')} className="mr-2" type="text" value={field.customValue} placeholder={__('Custom Value', 'bit-integrations')} formFields={formFields} />}

        <select className="btcd-paper-inp" name="autonamiField" value={field.autonamiField} onChange={(ev) => handleFieldMapping(ev, i)} disabled={isRequired}>
          <option value="">{__('Select Field', 'bit-integrations')}</option>
          {
            isRequired ? autonamiConf?.default?.fields && Object.values(autonamiConf.default.fields).map(fld => (
              <option key={`${fld.key}-1`} value={fld.key}>
                {fld.label}
              </option>
            )) : notResquiredField && notResquiredField.map(fld => (
              <option key={`${fld.key}-1`} value={fld.key}>
                {fld.label}
              </option>
            ))
          }
        </select>
      </div>
      {(!isRequired)
        && (
          <>
            <button
              onClick={() => addFieldMap(i)}
              className="icn-btn sh-sm ml-2 mr-1"
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
