/* eslint-disable no-param-reassign */

import { __ } from '../../../Utils/i18nwrap'
import TableCheckBox from '../../Utilities/TableCheckBox'
import 'react-multiple-select-dropdown-lite/dist/index.css'

export default function SmailyActions({ smailyConf, setSmailyConf }) {
  const actionHandler = (e, type) => {
    const newConf = { ...smailyConf }
    if (type === 'unsubscribe') {
      if (e.target.checked) {
        newConf.actions.unsubscribe = true
      } else {
        delete newConf.actions.unsubscribe
      }
    }
    setSmailyConf({ ...newConf })
  }

  return (
    <div className="pos-rel d-flx w-8">
      <TableCheckBox checked={smailyConf.actions?.unsubscribe || false} onChange={(e) => actionHandler(e, 'unsubscribe')} className="wdt-200 mt-4 mr-2" value="update_subscriber" title={__('unsubscribe subscriber', 'bit-integrations')} subTitle={__('Set the subscriber\'s status as unsubscribed.', 'bit-integrations')} />
    </div>
  )
}
