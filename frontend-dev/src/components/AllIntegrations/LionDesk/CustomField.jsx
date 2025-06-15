import { __ } from '../../../Utils/i18nwrap'
import MtInput from '../../Utilities/MtInput'
import { handleCustomField } from './IntegrationHelpers'

export default function CustomField({ field, index, conf, setConf, fieldValue, fieldLabel, className }) {
  return (
    <MtInput
      onChange={e => handleCustomField(e, index, conf, setConf, fieldValue)}
      label={__(fieldLabel, 'bit-integrations')}
      className={className}
      type="text"
      value={field[fieldValue]}
      placeholder={__(fieldLabel, 'bit-integrations')}
    />
  )
}