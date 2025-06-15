/* eslint-disable no-param-reassign */
// eslint-disable-next-line import/no-extraneous-dependencies
import { __ } from '@wordpress/i18n'
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
    setRapidmailConf({ ...newConf })
  }

  return (
    <div className="pos-rel d-flx w-8">
      <TableCheckBox checked={rapidmailConf.actions?.send_activationmail || false} onChange={(e) => actionHandler(e, 'send_activationmail')} className="wdt-200 mt-4 mr-2" value="user_share" title={__('Double Opt-in', 'bit-integrations')} subTitle={__('Add Double Opt-in', 'bit-integrations')} />
    </div>
  )
}
