/* eslint-disable no-param-reassign */

import 'react-multiple-select-dropdown-lite/dist/index.css'
import { __ } from '../../../Utils/i18nwrap'
import TableCheckBox from '../../Utilities/TableCheckBox'

export default function WoodpeckerActions({ woodpeckerConf, setWoodpeckerConf }) {
  const actionHandler = (e, type) => {
    const newConf = { ...woodpeckerConf }
    if (type === 'update') {
      if (e.target.checked) {
        newConf.actions.update = true
      } else {
        delete newConf.actions.update
      }
    }
    setWoodpeckerConf({ ...newConf })
  }

  return (
    <div className="pos-rel d-flx flx-wrp">
      {woodpeckerConf.actionName !== 'create_company' && <TableCheckBox checked={woodpeckerConf.actions?.update || false} onChange={(e) => actionHandler(e, 'update')} className="wdt-200 mt-4 mr-2" value="user_share" title={__('Update Prospects', 'bit-integrations')} subTitle={__('Update Responses with Prospects existing Data?', 'bit-integrations')} />}
    </div>
  )
}

