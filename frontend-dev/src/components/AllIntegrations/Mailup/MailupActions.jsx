/* eslint-disable no-param-reassign */

import { __ } from '../../../Utils/i18nwrap'
import TableCheckBox from '../../Utilities/TableCheckBox'
import 'react-multiple-select-dropdown-lite/dist/index.css'

export default function MailupActions({ mailupConf, setMailupConf }) {
  const actionHandler = (e) => {
    const newConf = { ...mailupConf }
    if (e.target.checked) {
      newConf.actions.doubleOptIn = true
    } else {
      delete newConf.actions.doubleOptIn
    }
    setMailupConf({ ...newConf })
  }

  return (

    <div className="pos-rel d-flx w-8">
      <TableCheckBox checked={mailupConf.actions?.doubleOptIn || false} onChange={(e) => actionHandler(e)} className="wdt-200 mt-4 mr-2" value="doubleOptIn" title={__('Double Opt-in', 'bit-integrations')} subTitle={__('Add Double Opt-in', 'bit-integrations')} />

    </div>
  )
}
