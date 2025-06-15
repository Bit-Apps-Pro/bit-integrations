/* eslint-disable max-len */
/* eslint-disable no-param-reassign */

import { useState } from 'react'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import ConfirmModal from '../../Utilities/ConfirmModal'
import TableCheckBox from '../../Utilities/TableCheckBox'
import 'react-multiple-select-dropdown-lite/dist/index.css'

export default function ZoomActions({ zoomConf, setZoomConf, formFields }) {
  const [isLoading, setIsLoading] = useState(false)
  const [actionMdl, setActionMdl] = useState({ show: false, action: () => { } })
  const actionHandler = (e, type) => {
    const newConf = { ...zoomConf }
    if (type === 'createRegistrant') {
      if (e.target?.checked) {
        newConf.actions.createRegistrant = true
      } else {
        delete newConf.actions.createRegistrant
      }
    } else if (type === 'deleteRegistrant') {
      if (e.target?.checked) {
        newConf.actions.deleteRegistrant = true
      } else {
        delete newConf.actions.deleteRegistrant
      }
    } else if (type === 'createUser') {
      if (e.target?.checked) {
        newConf.actions.createUser = true
      } else {
        delete newConf.actions.createUser
      }
    } else if (type === 'deleteUser') {
      if (e.target?.checked) {
        newConf.actions.deleteUser = true
      } else {
        delete newConf.actions.deleteUser
      }
    }

    setZoomConf({ ...newConf })
  }

  return (
    <div className="d-flx wdt-200">
      <div className="pos-rel d-flx flx-col w-8 mr-8">
        <TableCheckBox checked={zoomConf?.actions?.createRegistrant || false} onChange={(e) => actionHandler(e, 'createRegistrant')} className={`wdt-200 mt-4 mr-2 ${zoomConf.actions?.deleteRegistrant ? 'input-disable' : ''}`} value="createRegistrant" title={__('Create Registrant', 'bit-integrations')} subTitle={__('Create a meeting registrant', 'bit-integrations')} />
      </div>
      <div className="pos-rel d-flx flx-col w-8 mr-8">
        <TableCheckBox checked={zoomConf?.actions?.deleteRegistrant || false} onChange={(e) => actionHandler(e, 'deleteRegistrant')} className={`wdt-200 mt-4 mr-2 ${zoomConf.actions?.createRegistrant ? 'input-disable' : ''}`} value="deleteRegistrant" title={__('Delete Registrant', 'bit-integrations')} subTitle={__('Delete Meeting registrant using email', 'bit-integrations')} />
      </div>
      <div className="pos-rel d-flx flx-col w-8 mr-8">
        <TableCheckBox checked={zoomConf?.actions?.createUser || false} onChange={(e) => actionHandler(e, 'createUser')} className={`wdt-200 mt-4 mr-2 ${zoomConf.actions?.deleteUser ? 'input-disable' : ''}`} value="createUser" title={__('Create User', 'bit-integrations')} subTitle={__('Create User to your account', 'bit-integrations')} />
      </div>
      <div className="pos-rel d-flx flx-col w-8">
        <TableCheckBox checked={zoomConf?.actions?.deleteUser || false} onChange={(e) => actionHandler(e, 'deleteUser')} className={`wdt-200 mt-4 mr-2 ${zoomConf.actions?.createUser ? 'input-disable' : ''}`} value="deleteUser" title={__('Delete User', 'bit-integrations')} subTitle={__('Delete User from your account', 'bit-integrations')} />
      </div>
    </div>
  )
}
