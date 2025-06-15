import { useRecoilValue } from 'recoil'
import { $btcbi } from '../../../GlobalStates'
import TrashIcn from '../../../Icons/TrashIcn'
import { __ } from '../../../Utils/i18nwrap'
import { SmartTagField } from '../../../Utils/StaticData/SmartTagField'
import TagifyInput from '../../Utilities/TagifyInput'
import { addFieldMap, delFieldMap, handleFieldMapping } from './PodHelperFunction'

export default function PodsFieldMap({ i, type, formFields, field, podsConf, setPodsConf, podFields, fieldType }) {
  const fldType = {
    post: {
      propName: 'post_map',
      fldName: 'postFormField',
    },
    pod: {
      propName: 'pod_field_map',
      fldName: 'podField',
    },
    podFile: {
      propName: 'pod_file_map',
      fldName: 'podFile',
    },
  }

  const { propName, fldName } = fldType[type]

  const isRequired = !!podFields.find(fl => fl.key === field[fldName] && fl.required)

  const btcbi = useRecoilValue($btcbi)
  const { isPro } = btcbi

  const handleCustomValue = (event, indx) => {
    const newConf = { ...podsConf }
    newConf[propName][indx].customValue = event
    setPodsConf(newConf)
  }

  return (
    <div className="flx mt-2 mb-2 btcbi-field-map">
      <div className="flx integ-fld-wrp">
        <select className="btcd-paper-inp mr-2" name="formField" value={field.formField || ''} onChange={(ev) => handleFieldMapping(propName, ev, i, podsConf, setPodsConf)}>
          <option value="">{__('Select Field', 'bit-integrations')}</option>
          {fieldType === 'fields' ? (
            <>
              <optgroup label="Form Fields">
                { formFields?.map(f => f.type !== 'file' && (
                  <option key={`ff-zhcrm-${f.name}`} value={f.name}>{f.label}</option>
                ))}
              </optgroup>
              <option value="custom">{__('Custom...', 'bit-integrations')}</option>
              <optgroup label={`General Smart Codes ${isPro ? '' : '(PRO)'}`}>
                {isPro && SmartTagField?.map(f => (
                  <option key={`ff-zhcrm-${f.name}`} value={f.name}>
                    {f.label}
                  </option>
                ))}
              </optgroup>
            </>
          ) : (

            formFields?.map(f => f.type === 'file' && <option key={`ff-zhcrm-${f.name}`} value={f.name}>{f.label}</option>)

          ) }
        </select>
        {field.formField === 'custom' && <TagifyInput onChange={val => handleCustomValue(val, i)} label={__('Custom Value', 'bit-integrations')} className="mr-2" type="text" value={field.customValue || ''} placeholder={__('type # to use trigger field', 'bit-integrations')} formFields={formFields} />}
        <select className="btcd-paper-inp" name={fldName} value={field[fldName] || ''} onChange={(ev) => handleFieldMapping(propName, ev, i, podsConf, setPodsConf)} disabled={isRequired}>
          <option value="">{__('Select Field', 'bit-integrations')}</option>
          {
            podFields?.map(header => (
              <option key={`${header.key}-1`} value={header.key}>
                {`${header.name}`}
              </option>
            ))
          }
        </select>
      </div>

      {
        isRequired
          ? (
            <button
              onClick={() => addFieldMap(propName, i, podsConf, setPodsConf)}
              className="icn-btn sh-sm ml-2 mr-1"
              type="button"
            >
              +
            </button>
          )
          : (
            <>
              <button
                onClick={() => addFieldMap(propName, i, podsConf, setPodsConf)}
                className="icn-btn sh-sm ml-2 mr-1"
                type="button"
              >
                +
              </button>
              <button onClick={() => delFieldMap(propName, i, podsConf, setPodsConf)} className="icn-btn sh-sm ml-1" type="button" aria-label="btn">
                <TrashIcn />
              </button>
            </>
          )
      }

    </div>
  )
}
