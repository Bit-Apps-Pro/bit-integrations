/* eslint-disable no-param-reassign */

import { __ } from '../../../Utils/i18nwrap'
import TableCheckBox from '../../Utilities/TableCheckBox'

export default function AutonamiActions({ autonamiConf, setAutonamiConf }) {
  const actionHandler = (e, type) => {
    const newConf = { ...autonamiConf }
    if (type === 'exists') {
      if (e.target.checked) {
        newConf.actions.skip_if_exists = true
      } else {
        delete newConf.actions.skip_if_exists
      }
    }
    setAutonamiConf({ ...newConf })
  }

  return (
    <div className="pos-rel d-flx w-8">
      <TableCheckBox
        checked={autonamiConf.actions?.skip_if_exists || false}
        onChange={(e) => actionHandler(e, 'exists')}
        className="wdt-200 mt-4 mr-2"
        value="skip_if_exists"
        title={__('Skip exist Contact', 'bit-integrations')}
        subTitle={__(
          'Skip if contact already exist in Autonami',
          'bit-integrations',
        )}
      />
    </div>
  )
}
