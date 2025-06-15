import { useRecoilValue } from 'recoil'
import TrashIcn from '../../../Icons/TrashIcn'
import { __ } from '../../../Utils/i18nwrap'
import TagifyInput from '../../Utilities/TagifyInput'
import { SmartTagField } from '../../../Utils/StaticData/SmartTagField'

import { addFieldMap, delFieldMap, handleFieldMapping } from './PostHelperFunction'
import { $btcbi } from '../../../GlobalStates'

export default function FieldMap({ i, type, formFields, field, postConf, setPostConf, customFields }) {
  const fldType = {
    acf: {
      propName: 'acf_map',
      fldName: 'acfField',
    },
    post: {
      propName: 'post_map',
      fldName: 'postField',
    },
    acfFile: {
      propName: 'acf_file_map',
      fldName: 'acfFileUpload',
    },
  }

  const { propName, fldName } = fldType[type]

  const handleCustomValue = (val, indx) => {
    const newConf = { ...postConf }
    newConf[propName][indx].customValue = val
    setPostConf(newConf)
  }

  const isRequired = !!customFields.find(fl => fl.key === field[fldName] && fl.required)
  const btcbi = useRecoilValue($btcbi)
  const { isPro } = btcbi
  return (
    <div className="flx mt-2 mb-2 btcbi-field-map">
      <div className="flx integ-fld-wrp">
        <select className="btcd-paper-inp mr-2" name="formField" value={field.formField || ''} onChange={(ev) => handleFieldMapping(propName, ev, i, postConf, setPostConf)}>
          <option value="">{__('Select Field', 'bit-integrations')}</option>
          <optgroup label="Form Fields">
            { formFields?.map(f => <option key={`ff-zhcrm-${f.name}`} value={f.name}>{f.label}</option>)}

          </optgroup>
          <option value="custom">{__('Custom...', 'bit-integrations')}</option>
          <optgroup label={`General Smart Codes ${isPro ? '' : '(PRO)'}`}>
            {isPro && SmartTagField?.map(f => (
              <option key={`ff-zhcrm-${f.name}`} value={f.name}>
                {f.label}
              </option>
            ))}
          </optgroup>
        </select>
        {field.formField === 'custom' && <TagifyInput onChange={val => handleCustomValue(val, i)} label={__('Custom Value', 'bit-integrations')} className="mr-2" type="text" value={field.customValue || ''} placeholder={__('type # to use trigger field', 'bit-integrations')} formFields={formFields} />}
        <select className="btcd-paper-inp" name={fldName} value={field[fldName] || ''} onChange={(ev) => handleFieldMapping(propName, ev, i, postConf, setPostConf)} disabled={isRequired}>
          <option value="">{__('Select Field', 'bit-integrations')}</option>
          {
            customFields?.map(header => (
              <option key={`${header.key}-1`} value={header.key}>
                {`${header.name}`}
              </option>
            ))
          }
        </select>

      </div>

      {!isRequired
        && (
          <>
            <button
              onClick={() => addFieldMap(propName, i, postConf, setPostConf)}
              className="icn-btn sh-sm ml-2 mr-1"
              type="button"
            >
              +
            </button>
            <button onClick={() => delFieldMap(propName, i, postConf, setPostConf)} className="icn-btn sh-sm ml-1" type="button" aria-label="btn">
              <TrashIcn />
            </button>
          </>
        )}

    </div>
  )
}
