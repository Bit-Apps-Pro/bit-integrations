/* eslint-disable no-param-reassign */

import { __ } from '../../../Utils/i18nwrap'
import TableCheckBox from '../../Utilities/TableCheckBox'

export default function MailPoetActions({ mailPoetConf, setMailPoetConf, formFields }) {
  const actionHandler = (e, type) => {
    const newConf = { ...mailPoetConf }
    if (type === 'update') {
      if (e.target.checked) {
        newConf.actions.update = true
      } else {
        delete newConf.actions.update
      }
    }
    setMailPoetConf({ ...newConf })
  }

  return (

    <div className="pos-rel d-flx w-8">
      <TableCheckBox checked={mailPoetConf.actions?.update || false} onChange={(e) => actionHandler(e, 'update')} className="wdt-200 mt-4 mr-2" value="user_share" title={__('Update MailPoet', 'bit-integrations')} subTitle={__('Update Responses with Mailpoet exist Subscriber?', 'bit-integrations')} />
    </div>
  )
}
