import { useRecoilValue } from 'recoil'
import { $btcbi } from '../../../GlobalStates'
import { sortByField } from '../../../Utils/Helpers'
import { __ } from '../../../Utils/i18nwrap'
import { SmartTagField } from '../../../Utils/StaticData/SmartTagField'

export default function OneDriveFieldMap({ i, formFields, field, oneDriveConf, setOneDriveConf }) {
  const { isPro } = useRecoilValue($btcbi)

  const handleFieldMapping = (event, index) => {
    const newConf = { ...oneDriveConf }
    newConf.field_map[index][event.target.name] = event.target.value
    setOneDriveConf({ ...newConf })
  }

  return (
    <div className="flx mt-2 mb-2 btcbi-field-map">
      <div className="pos-rel flx">
        <div className="flx integ-fld-wrp">
          <select className="btcd-paper-inp mr-2" name="formField" value={field.formField || ''} onChange={(ev) => handleFieldMapping(ev, i)}>
            <option value="">{__('Select Field', 'bit-integrations')}</option>
            <optgroup label="Form Fields">
              {
                formFields?.filter(fld => fld.type === 'file').map(f => (
                  <option key={`ff-rm-${f.name}`} value={f.name}>
                    {f.label}
                  </option>
                ))
              }
            </optgroup>
            <optgroup label={`General Smart Codes ${isPro ? '' : '(PRO)'}`}>
              {isPro && SmartTagField?.map(f => (
                <option key={`ff-rm-${f.name}`} value={f.name}>
                  {f.label}
                </option>
              ))}
            </optgroup>
          </select>

          <select className="btcd-paper-inp" name="OneDriveFormField" value={field.OneDriveFormField} onChange={(ev) => handleFieldMapping(ev, i)}>
            <option value="">{__('Select Folder', 'bit-integrations')}</option>
            {
              sortByField(oneDriveConf.foldersList, 'name', 'ASC').map(({ name, id }) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))
            }
          </select>
        </div>

      </div>
    </div>
  )
}
