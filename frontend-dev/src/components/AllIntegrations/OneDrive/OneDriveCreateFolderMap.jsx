import { useRecoilValue } from 'recoil'
import { $btcbi } from '../../../GlobalStates'
import { __, sprintf } from '../../../Utils/i18nwrap'
import { SmartTagField } from '../../../Utils/StaticData/SmartTagField'
import TagifyInput from '../../Utilities/TagifyInput'

export default function OneDriveCreateFolderMap({ formFields, oneDriveConf, setOneDriveConf }) {
  const btcbi = useRecoilValue($btcbi)
  const { isPro } = btcbi

  const fieldMap = oneDriveConf?.actions?.create_folder_field_map || [
    { formField: '', customValue: '', target: 'name' },
    { formField: '', customValue: '', target: 'path' }
  ]

  const updateField = (index, patch) => {
    const newConf = { ...oneDriveConf }
    if (!newConf.actions) newConf.actions = {}
    const arr = [...fieldMap]
    arr[index] = { ...arr[index], ...patch }
    newConf.actions.create_folder_field_map = arr

    // Debug logging
    console.log('OneDrive Field Update:', {
      index,
      patch,
      updatedField: arr[index],
      fullFieldMap: arr
    })

    setOneDriveConf({ ...newConf })
  }

  return (
    <>
      <div className="mt-4">
        <b className="wdt-100">{__('Folder Fields', 'bit-integrations')}</b>
      </div>
      <div className="btcd-hr mt-1" />
      <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
        <div className="txt-dp">
          <b>{__('Form Fields', 'bit-integrations')}</b>
        </div>
        <div className="txt-dp">
          <b>{__('OneDrive Fields', 'bit-integrations')}</b>
        </div>
      </div>

      {fieldMap.map((field, i) => (
        <div key={`cf-field-${i}`} className="flx mt-2 mb-2 btcbi-field-map">
          <div className="pos-rel flx">
            <div className="flx integ-fld-wrp">
              <select
                className="btcd-paper-inp mr-2"
                name="formField"
                value={field.formField || ''}
                onChange={ev => updateField(i, { formField: ev.target.value })}>
                <option value="">{__('Select Field', 'bit-integrations')}</option>
                <optgroup label={__('Form Fields', 'bit-integrations')}>
                  {formFields?.map(f => (
                    <option key={`ff-rm-${f.name}`} value={f.name}>
                      {f.label}
                    </option>
                  ))}
                </optgroup>
                <option value="custom">{__('Custom...', 'bit-integrations')}</option>
                <optgroup
                  label={sprintf(
                    __('General Smart Codes %s', 'bit-integrations'),
                    isPro ? '' : `(${__('Pro', 'bit-integrations')})`
                  )}>
                  {isPro &&
                    SmartTagField?.map(f => (
                      <option key={`ff-rm-${f.name}`} value={f.name}>
                        {f.label}
                      </option>
                    ))}
                </optgroup>
              </select>

              {field.formField === 'custom' && (
                <input
                  onChange={e => updateField(i, { customValue: e.target.value })}
                  className="btcd-paper-inp mr-2"
                  type="text"
                  value={field.customValue || ''}
                  placeholder={
                    field.target === 'name'
                      ? __('Enter Folder Name', 'bit-integrations')
                      : __('Enter Folder Path', 'bit-integrations')
                  }
                />
              )}

              <select className="btcd-paper-inp" disabled name="onedriveFormField" value={field.target}>
                <option value={field.target}>
                  {field.target === 'name'
                    ? __('Name', 'bit-integrations')
                    : __('Path', 'bit-integrations')}
                </option>
              </select>
            </div>
          </div>
        </div>
      ))}
    </>
  )
}
