import { useRecoilValue } from 'recoil'
import { $btcbi } from '../../../GlobalStates'
import TrashIcn from '../../../Icons/TrashIcn'
import { __ } from '../../../Utils/i18nwrap'
import { SmartTagField } from '../../../Utils/StaticData/SmartTagField'
import MtInput from '../../Utilities/MtInput'
import TagifyInput from '../../Utilities/TagifyInput'
import { handleCustomValue } from '../IntegrationHelpers/IntegrationHelpers'

export default function FluentCrmFieldMap({ i, formFields, field, fluentCrmConf, setFluentCrmConf }) {
  const isRequired = field.required
  const notResquiredField = fluentCrmConf?.fluentCrmFlelds && Object.values(fluentCrmConf?.fluentCrmFlelds).filter((f => !f.required))
  const btcbi = useRecoilValue($btcbi)
  const { isPro } = btcbi
  const addFieldMap = (indx) => {
    const newConf = { ...fluentCrmConf }
    newConf.field_map.splice(indx, 0, {})
    setFluentCrmConf(newConf)
  }

  const delFieldMap = (indx) => {
    const newConf = { ...fluentCrmConf }
    if (newConf.field_map.length > 1) {
      newConf.field_map.splice(indx, 1)
    }
    setFluentCrmConf(newConf)
  }

  const handleFieldMapping = (event, indx) => {
    const newConf = { ...fluentCrmConf }
    newConf.field_map[indx][event.target.name] = event.target.value

    if (event.target.value === 'custom') {
      newConf.field_map[indx].customValue = ''
    }
    setFluentCrmConf(newConf)
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

        {field.formField === 'custom' && <TagifyInput onChange={e => handleCustomValue(e, i, fluentCrmConf, setFluentCrmConf)} label={__('Custom Value', 'bit-integrations')} className="mr-2" type="text" value={field.customValue} placeholder={__('Custom Value', 'bit-integrations')} formFields={formFields} />}

        <select className="btcd-paper-inp" name="fluentCRMField" value={field.fluentCRMField} onChange={(ev) => handleFieldMapping(ev, i)} disabled={isRequired}>
          <option value="">{__('Select Field', 'bit-integrations')}</option>
          {
            isRequired ? fluentCrmConf.fluentCrmFlelds && Object.values(fluentCrmConf.fluentCrmFlelds).map(fld => (
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
