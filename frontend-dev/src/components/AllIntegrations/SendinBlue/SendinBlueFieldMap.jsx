import { useRecoilValue } from 'recoil'
import { $btcbi } from '../../../GlobalStates'
import TrashIcn from '../../../Icons/TrashIcn'
import { __ } from '../../../Utils/i18nwrap'
import { SmartTagField } from '../../../Utils/StaticData/SmartTagField'
import MtInput from '../../Utilities/MtInput'
import TagifyInput from '../../Utilities/TagifyInput'
import { handleCustomValue } from '../IntegrationHelpers/IntegrationHelpers'
import Cooltip from '../../Utilities/Cooltip'
import { useState } from 'react'
import { create } from 'mutative'

export default function SendinBlueFieldMap({
  i,
  formFields,
  field,
  sendinBlueConf,
  setSendinBlueConf
}) {
  const [options, setOptions] = useState([])
  const isRequired = field.required
  const notResquiredField =
    sendinBlueConf?.default?.fields &&
    Object.values(sendinBlueConf?.default?.fields).filter((f) => !f.required)

  const btcbi = useRecoilValue($btcbi)
  const { isPro } = btcbi

  const addFieldMap = (indx) => {
    const newConf = { ...sendinBlueConf }
    newConf.field_map.splice(indx, 0, {})
    setSendinBlueConf(newConf)
  }

  const delFieldMap = (indx) => {
    const newConf = { ...sendinBlueConf }
    if (newConf.field_map.length > 1) {
      newConf.field_map.splice(indx, 1)
    }
    setSendinBlueConf(newConf)
  }

  const handleFieldMapping = (event, indx) => {
    const { name, value } = event.target

    setSendinBlueConf((prevConf) =>
      create(prevConf, (draftConf) => {
        draftConf.field_map[indx][name] = value

        if (name === 'sendinBlueField') {
          const field = notResquiredField.find((fld) => fld.fieldId === value)

          setOptions(field?.options || [])
        }

        if (value === 'custom') {
          draftConf.field_map[indx].customValue = ''
        }
      })
    )
  }

  return (
    <div className={isRequired ? 'mt-2 mr-1 flx w-9' : 'flx mt-2 mb-2 btcbi-field-map'}>
      <div className="flx integ-fld-wrp">
        <select
          className="btcd-paper-inp mr-2"
          name="formField"
          value={field.formField || ''}
          onChange={(ev) => handleFieldMapping(ev, i)}>
          <option value="">{__('Select Field', 'bit-integrations')}</option>
          <optgroup label={__('Form Fields', 'bit-integrations')}>
            {formFields.map(
              (f) =>
                f.type !== 'file' && (
                  <option key={`ff-zhcrm-${f.name}`} value={f.name}>
                    {f.label}
                  </option>
                )
            )}
          </optgroup>
          <option value="custom">{__('Custom...', 'bit-integrations')}</option>

          <optgroup
            label={`${__('General Smart Codes', 'bit-integrations')} ${isPro ? '' : `(${__('Pro', 'bit-integrations')})`}`}>
            {isPro &&
              SmartTagField?.map((f) => (
                <option key={`ff-rm-${f.name}`} value={f.name}>
                  {f.label}
                </option>
              ))}
          </optgroup>
        </select>

        {field.formField === 'custom' && (
          <TagifyInput
            onChange={(e) => handleCustomValue(e, i, sendinBlueConf, setSendinBlueConf)}
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
          name="sendinBlueField"
          value={field.sendinBlueField}
          onChange={(ev) => handleFieldMapping(ev, i)}
          disabled={isRequired}>
          <option value="">{__('Select Field', 'bit-integrations')}</option>
          {isRequired
            ? sendinBlueConf?.default?.fields &&
              Object.values(sendinBlueConf.default.fields).map((fld) => (
                <option key={`${fld.fieldId}-1`} value={fld.fieldId}>
                  {fld.fieldName}
                </option>
              ))
            : notResquiredField &&
              notResquiredField.map((fld) => (
                <option key={`${fld.fieldId}-1`} value={fld.fieldId}>
                  {fld.fieldName}
                </option>
              ))}
        </select>
      </div>
      <div className="flx integ-fld-wrp">
        {options?.length > 0 && (
          <div>
            <Cooltip width={250} icnSize={20} className="ml-2">
              <div className="txt-body">
                <p>{__('Custom Field options with Associated Values', 'bit-integrations')}</p>
                {options?.map((option) => (
                  <li key={option.value}>
                    {option?.label} ({__('value')}: {option?.value})
                  </li>
                ))}
              </div>
            </Cooltip>
          </div>
        )}
        {!isRequired && (
          <>
            <button onClick={() => addFieldMap(i)} className="icn-btn sh-sm ml-2" type="button">
              +
            </button>
            <button
              onClick={() => delFieldMap(i)}
              className="icn-btn sh-sm ml-2"
              type="button"
              aria-label="btn">
              <TrashIcn />
            </button>
          </>
        )}
      </div>
    </div>
  )
}
