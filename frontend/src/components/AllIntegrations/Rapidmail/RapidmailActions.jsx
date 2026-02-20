/* eslint-disable no-param-reassign */
// eslint-disable-next-line import/no-extraneous-dependencies
import { __ } from '../../../Utils/i18nwrap'
import TableCheckBox from '../../Utilities/TableCheckBox'

export default function RapidmailActions({ rapidmailConf, setRapidmailConf }) {
  const actionHandler = (e, type) => {
    const newConf = { ...rapidmailConf }
    if (type === 'send_activationmail') {
      if (e.target.checked) {
        newConf.actions.send_activationmail = true
      } else {
        delete newConf.actions.send_activationmail
      }
    }
    if (type === 'force_subscribe') {
      if (e.target.checked) {
        newConf.actions.force_subscribe = true
      } else {
        delete newConf.actions.force_subscribe
      }
    }
    setRapidmailConf({ ...newConf })
  }

  return (
    <div className="pos-rel d-flx w-8">
      <TableCheckBox
        checked={rapidmailConf.actions?.send_activationmail || false}
        onChange={e => actionHandler(e, 'send_activationmail')}
        className="wdt-200 mt-4 mr-2"
        value="user_share"
        title={__('Double Opt-in', 'bit-integrations')}
        subTitle={__('Add Double Opt-in', 'bit-integrations')}
      />
      <TableCheckBox
        checked={rapidmailConf.actions?.force_subscribe || false}
        onChange={e => actionHandler(e, 'force_subscribe')}
        className="wdt-200 mt-4 mr-2"
        value="force_subscribe"
        title={__('Force Subscribe', 'bit-integrations')}
        subTitle={__('Subscribe without confirmation (status: active)', 'bit-integrations')}
      />
    </div>
  )
}
