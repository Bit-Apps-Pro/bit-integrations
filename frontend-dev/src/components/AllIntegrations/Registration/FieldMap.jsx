import { useRecoilValue } from 'recoil'
import TrashIcn from '../../../Icons/TrashIcn'
import { __ } from '../../../Utils/i18nwrap'
import { addFieldMap, delFieldMap, handleFieldMapping } from './UserHelperFunction'
import { SmartTagField } from '../../../Utils/StaticData/SmartTagField'
import { $btcbi } from '../../../GlobalStates'
import TagifyInput from '../../Utilities/TagifyInput'

export default function FieldMap({ i, type, formFields, field, userConf, setUserConf, customFields, setSnackbar }) {
  const fldType = {
    user: {
      propName: 'user_map',
      fldName: 'userField',
    },
    meta: {
      propName: 'meta_map',
      fldName: 'metaField',
    },
  }
  const { propName, fldName } = fldType[type]

  const isRequired = !!customFields.find(fl => fl.key === field[fldName] && fl.required)

  const btcbi = useRecoilValue($btcbi)
  const { isPro } = btcbi

  const handleCustomValue = (event, index, conftTmp, setConf) => {
    const newConf = { ...conftTmp }
    newConf[propName][index].customValue = event
    setConf({ ...newConf })
  }

  return (
    <div className="flx mt-2 mb-2 btcbi-field-map">
      <div className="flx integ-fld-wrp">
        <select className="btcd-paper-inp mr-2" name="formField" value={field.formField || ''} onChange={(ev) => handleFieldMapping(propName, ev, i, userConf, setUserConf, formFields, setSnackbar)}>
          <option value="">{__('Select Field', 'bit-integrations')}</option>
          <optgroup label="Form Fields">
            {

              formFields?.map(f => f.type !== 'file' && <option key={`ff-zhcrm-${f?.name}`} value={f.name}>{f.label}</option>)
            }
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
        {field.formField === 'custom' && <TagifyInput onChange={e => handleCustomValue(e, i, userConf, setUserConf)} label={__('Custom Value', 'bit-integrations')} className="mr-2" type="text" value={field.customValue || ''} placeholder={__('Custom Value', 'bit-integrations')} formFields={formFields} />}

        {
          type !== 'meta' ? (
            <select className="btcd-paper-inp" name={fldName} value={field[fldName] || ''} onChange={(ev) => handleFieldMapping(propName, ev, i, userConf, setUserConf, formFields, setSnackbar)} disabled={isRequired}>
              <option>{__('Select Field', 'bit-integrations')}</option>
              {
                customFields?.map(header => (
                  <option key={`${header.key}-1`} value={header.key}>
                    {`${header.name}`}
                  </option>
                ))
              }
            </select>
          ) : (
            <input className="btcd-paper-inp" name={fldName} value={field[fldName] || ''} onChange={(ev) => handleFieldMapping(propName, ev, i, userConf, setUserConf, formFields, setSnackbar)} type="text" />
          )
        }

      </div>

      {!isRequired
        && (
          <>
            <button
              onClick={() => addFieldMap(propName, i, userConf, setUserConf)}
              className="icn-btn sh-sm ml-2 mr-1"
              type="button"
            >
              +
            </button>
            <button onClick={() => delFieldMap(propName, i, userConf, setUserConf)} className="icn-btn sh-sm ml-1" type="button" aria-label="btn">
              <TrashIcn />
            </button>
          </>
        )}

    </div>
  )
}
