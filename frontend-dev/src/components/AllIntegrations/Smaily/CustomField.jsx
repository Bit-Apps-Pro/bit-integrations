import { __ } from '../../../Utils/i18nwrap'
import MtInput from '../../Utilities/MtInput'
import { handleCustomField } from './IntegrationHelpers'

export default function CustomField({ field, index, smailyConf, setSmailyConf, fieldValue, fieldLabel, className }) {
  return (
    <MtInput
      onChange={e => handleCustomField(e, index, smailyConf, setSmailyConf, fieldValue)}
      label={__(fieldLabel, 'bit-integrations')}
      className={className}
      type="text"
      value={field[fieldValue]}
      placeholder={__(fieldLabel, 'bit-integrations')}
    />
  )
}
