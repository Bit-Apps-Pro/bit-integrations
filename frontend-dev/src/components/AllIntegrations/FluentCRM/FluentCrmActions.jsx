/* eslint-disable no-param-reassign */

import { __ } from '../../../Utils/i18nwrap'
import TableCheckBox from '../../Utilities/TableCheckBox'

export default function FluentCrmActions({ fluentCrmConf, setFluentCrmConf, formFields }) {
  const actionHandler = (e, type) => {
    const newConf = { ...fluentCrmConf }
    if (type === 'exists') {
      if (e.target.checked) {
        newConf.actions.skip_if_exists = true
      } else {
        delete newConf.actions.skip_if_exists
      }
    }
    if (type === 'doubleOpIn') {
      if (e.target.checked) {
        newConf.actions.double_opt_in = true
      } else {
        delete newConf.actions.double_opt_in
      }
    }
    setFluentCrmConf({ ...newConf })
  }

  return (

    <div className="pos-rel d-flx w-8">
      <TableCheckBox checked={fluentCrmConf.actions?.skip_if_exists || false} onChange={(e) => actionHandler(e, 'exists')} className="wdt-200 mt-4 mr-2" value="skip_if_exists" title={__('Skip exist Contact', 'bit-integrations')} subTitle={__('Skip if contact already exist in FluentCRM', 'bit-integrations')} />
      <TableCheckBox checked={fluentCrmConf.actions?.double_opt_in || false} onChange={(e) => actionHandler(e, 'doubleOpIn')} className="wdt-200 mt-4 mr-2" value="double_opt_in" title={__('Double Opt-in', 'bit-integrations')} subTitle={__('Enable Double Option for new contacts', 'bit-integrations')} />
    </div>

  )
}
