import { useMemo } from 'react'
import { useRecoilValue } from 'recoil'
import { $btcbi } from '../../../GlobalStates'
import TrashIcn from '../../../Icons/TrashIcn'
import { __ } from '../../../Utils/i18nwrap'
import { SmartTagField } from '../../../Utils/StaticData/SmartTagField'
import TagifyInput from '../../Utilities/TagifyInput'
import { addFieldMap, delFieldMap, handleFieldMapping } from './UserHelperFunction'

export default function FieldMap({
  i,
  type,
  formFields,
  field,
  userConf,
  setUserConf,
  customFields,
  setSnackbar
}) {
  const fldType = {
    user: {
      propName: 'user_map',
      fldName: 'userField'
    },
    meta: {
      propName: 'meta_map',
      fldName: 'metaField'
    }
  }
  const { propName, fldName } = fldType[type]
  const btcbi = useRecoilValue($btcbi)
  const { isPro } = btcbi

  const requiredFlds = useMemo(() => customFields.filter((fld) => fld.required), [customFields])
  const nonRequiredFlds = useMemo(() => customFields.filter((fld) => !fld.required), [customFields])

  const handleCustomValue = (event, index, conftTmp, setConf) => {
    const newConf = { ...conftTmp }
    newConf[propName][index].customValue = event
    setConf({ ...newConf })
  }

  return (
    <div className="flx mt-2 mb-2 btcbi-field-map">
      <div className="flx integ-fld-wrp">
        <select
          className="btcd-paper-inp mr-2"
          name="formField"
          value={field.formField || ''}
          onChange={(ev) =>
            handleFieldMapping(propName, ev, i, userConf, setUserConf, formFields, setSnackbar)
          }>
          <option value="">{__('Select Field', 'bit-integrations')}</option>
          <optgroup label={__('Form Fields', 'bit-integrations')}>
            {formFields?.map(
              (f) =>
                f.type !== 'file' && (
                  <option key={`ff-zhcrm-${f?.name}`} value={f.name}>
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
                <option key={`ff-zhcrm-${f.name}`} value={f.name}>
                  {f.label}
                </option>
              ))}
          </optgroup>
        </select>
        {field.formField === 'custom' && (
          <TagifyInput
            onChange={(e) => handleCustomValue(e, i, userConf, setUserConf)}
            label={__('Custom Value', 'bit-integrations')}
            className="mr-2"
            type="text"
            value={field.customValue || ''}
            placeholder={__('Custom Value', 'bit-integrations')}
            formFields={formFields}
          />
        )}

        {type !== 'meta' ? (
          <select
            className="btcd-paper-inp"
            name={fldName}
            value={field[fldName] || ''}
            onChange={(ev) =>
              handleFieldMapping(propName, ev, i, userConf, setUserConf, formFields, setSnackbar)
            }
            disabled={i < requiredFlds.length}>
            <option>{__('Select Field', 'bit-integrations')}</option>

            {i < requiredFlds.length ? (
              <option key={`${requiredFlds[i].key}-1`} value={requiredFlds[i].key}>
                {requiredFlds[i].name}
              </option>
            ) : (
              nonRequiredFlds.map(({ key, name }) => (
                <option key={key} value={key}>
                  {name}
                </option>
              ))
            )}
          </select>
        ) : (
          <input
            className="btcd-paper-inp"
            name={fldName}
            value={field[fldName] || ''}
            onChange={(ev) =>
              handleFieldMapping(propName, ev, i, userConf, setUserConf, formFields, setSnackbar)
            }
            type="text"
          />
        )}
      </div>

      {i >= requiredFlds.length && (
        <>
          <button
            onClick={() => addFieldMap(propName, i, userConf, setUserConf)}
            className="icn-btn sh-sm ml-2 mr-1"
            type="button">
            +
          </button>
          <button
            onClick={() => delFieldMap(propName, i, userConf, setUserConf)}
            className="icn-btn sh-sm ml-1"
            type="button"
            aria-label="btn">
            <TrashIcn />
          </button>
        </>
      )}
    </div>
  )
}
