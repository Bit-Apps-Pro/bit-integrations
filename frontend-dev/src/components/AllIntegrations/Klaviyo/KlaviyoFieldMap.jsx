import { useRecoilValue } from 'recoil'
import { $btcbi } from '../../../GlobalStates'
import { __ } from '../../../Utils/i18nwrap'
import { SmartTagField } from '../../../Utils/StaticData/SmartTagField'
import MtInput from '../../Utilities/MtInput'
import TagifyInput from '../../Utilities/TagifyInput'
import { addFieldMap, delFieldMap, handleFieldMapping } from '../GlobalIntegrationHelper'
import { handleCustomValue } from '../IntegrationHelpers/IntegrationHelpers'
import { generateMappedField } from './KlaviyoCommonFunc'

function KlaviyoFieldMap({ i, field, formFields, klaviyoConf, setKlaviyoConf }) {
  const btcbi = useRecoilValue($btcbi)
  const { isPro } = btcbi

  if (klaviyoConf?.field_map?.length === 1 && field.klaviyoFormField === '') {
    const newConf = { ...klaviyoConf }
    const tmp = generateMappedField(newConf)
    newConf.field_map = tmp
    setKlaviyoConf(newConf)
  }

  const requiredFields = klaviyoConf?.klaviyoFields.filter(fld => fld.required === true) || []

  const nonrequiredFields = klaviyoConf?.klaviyoFields.filter(fld => fld.required === false) || []

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
              handleFieldMapping(event, i, klaviyoConf, setKlaviyoConf)
            }}
            value={field.formField || ''}
          >
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

          {/* When user select custom field */}

          {field.formField === 'custom' && <TagifyInput onChange={e => handleCustomValue(e, i, klaviyoConf, setKlaviyoConf)} label={__('Custom Value', 'bit-integrations')} className="mr-2" type="text" value={field.customValue} placeholder={__('Custom Value', 'bit-integrations')} formFields={formFields} />}

          <select
            className="btcd-paper-inp"
            disabled={i < requiredFields.length}
            name="klaviyoFormField"
            onChange={(event) => {
              handleFieldMapping(event, i, klaviyoConf, setKlaviyoConf)
            }}
            value={i < requiredFields.length ? (requiredFields[i].key || '') : (field.klaviyoFormField || '')}
          >
            <option value="">{__('Select Field', 'bit-integrations')}</option>
            {
              i < requiredFields.length ? (
                <option key={requiredFields[i].key} value={requiredFields[i].key}>
                  {requiredFields[i].label}
                </option>
              ) : (
                nonrequiredFields.map(({ key, label }) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))
              )
            }
          </select>
        </div>
        <button
          onClick={() => addFieldMap(i, klaviyoConf, setKlaviyoConf)}
          className="icn-btn sh-sm ml-2 mr-1"
          type="button"
        >
          +
        </button>
        <button onClick={() => delFieldMap(i, klaviyoConf, setKlaviyoConf)} className="icn-btn sh-sm ml-1" type="button" aria-label="btn">
          <span className="btcd-icn icn-trash-2" />
        </button>
      </div>
    </div>
  )
}

export default KlaviyoFieldMap
