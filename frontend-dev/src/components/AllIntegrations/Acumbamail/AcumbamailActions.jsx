/* eslint-disable no-param-reassign */

import { useState } from 'react'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import TableCheckBox from '../../Utilities/TableCheckBox'

export default function AcumbamailActions({ acumbamailConf, setAcumbamailConf, formFields }) {
  const [isLoading, setIsLoading] = useState(false)
  const actionHandler = (e, type) => {
    const newConf = { ...acumbamailConf }
    if (type === 'double_optin') {
      if (e.target.checked) {
        newConf.actions.double_optin = true
      } else {
        delete newConf.actions.double_optin
      }
    }
    setAcumbamailConf({ ...newConf })
  }

  return (
    <div className="pos-rel d-flx w-8">
      <TableCheckBox checked={acumbamailConf.actions?.double_optin || false} onChange={(e) => actionHandler(e, 'double_optin')} className="wdt-200 mt-4 mr-2" value="double_optin" title={__('Double Opt-in', 'bit-integrations')} subTitle={__('Double Opt-In for confirm subscription.', 'bit-integrations')} />
    </div>
  )
}
