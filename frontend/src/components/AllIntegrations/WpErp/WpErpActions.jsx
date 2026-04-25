/* eslint-disable no-param-reassign */

import 'react-multiple-select-dropdown-lite/dist/index.css'
import { __ } from '../../../Utils/i18nwrap'
import TableCheckBox from '../../Utilities/TableCheckBox'

const deleteActions = ['deleteContact', 'deleteCompany']
export default function WpErpActions({ wpErpConf, setWpErpConf }) {

  const actionHandler = (e, type) => {
    const newConf = { ...wpErpConf }

    if (e.target.checked) {
      newConf.utilities[type] = true
    } else {
      delete newConf.utilities[type]
    }

    setWpErpConf({ ...newConf })
  }

  return (
    <div className="pos-rel d-flx flx-wrp">
      {deleteActions.includes(wpErpConf.mainAction) &&
        (
          <TableCheckBox
            checked={wpErpConf.utilities?.force_delete || false}
            onChange={e => actionHandler(e, 'force_delete')}
            className="wdt-200 mt-4 mr-2"
            value="force_delete"
            title={__('Force Delete', 'bit-integrations')}
            subTitle={__('Permanently delete without soft delete?', 'bit-integrations')}
          />
        )
      }
    </div>
  )
}
