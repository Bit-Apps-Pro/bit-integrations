/* eslint-disable no-param-reassign */

import { __ } from '../../../Utils/i18nwrap'
import TableCheckBox from '../../Utilities/TableCheckBox'

export default function PCloudActions({ pCloudConf, setPCloudConf }) {
  const actionHandler = (e, type) => {
    const newConf = { ...pCloudConf }
    if (type === 'deleteFile') {
      if (e.target.checked) {
        newConf.actions.delete_from_wp = true
      } else {
        delete newConf.actions.delete_from_wp
      }
    }
    setPCloudConf({ ...newConf })
  }

  return (
    <div className="pos-rel d-flx w-8">
      <TableCheckBox
        checked={pCloudConf.actions?.delete_from_wp || false}
        onChange={e => actionHandler(e, 'deleteFile')}
        className="mt-4 mr-2"
        value="delete_from_wp"
        title={__('Delete File From Wordpress', 'bit-integrations')}
        subTitle={__('Delete file from Wordpress after upload in PCloud', 'bit-integrations')}
      />
    </div>
  )
}
