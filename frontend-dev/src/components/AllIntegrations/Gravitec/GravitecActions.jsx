/* eslint-disable no-param-reassign */

import { useState } from 'react'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { __ } from '../../../Utils/i18nwrap'
import ConfirmModal from '../../Utilities/ConfirmModal'
import TableCheckBox from '../../Utilities/TableCheckBox'

export default function GravitecActions({ gravitecConf, setGravitecConf, loading, setLoading }) {
  const [actionMdl, setActionMdl] = useState({ show: false, action: () => { } })

  const actionHandler = (e, type) => {
    const newConf = { ...gravitecConf }
    if (type === 'button') {
      if (e.target?.checked) {
        if (newConf.selectedButtonTitle === undefined) {
          newConf.selectedButtonTitle = ""
        }
        if (newConf.selectedButtonURL === undefined) {
          newConf.selectedButtonURL = ""
        }
        newConf.actions.button = true
      } else {
        setActionMdl({ show: false })
        delete newConf.actions.button
      }
    }

    setActionMdl({ show: type })
    setGravitecConf(newConf)
  }

  const clsActionMdl = () => {
    setActionMdl({ show: false })
  }

  const setChanges = (val, name) => {
    setGravitecConf(prevConf => {
      const newConf = { ...prevConf }
      newConf[name] = val
      return newConf
    })
  }

  return (
    <div className="pos-rel d-flx flx-wrp">
      {gravitecConf.actionName === 'notification' && <TableCheckBox checked={(gravitecConf?.selectedButtonTitle?.length && gravitecConf?.selectedButtonURL?.length) || false} onChange={(e) => actionHandler(e, 'button')} className="wdt-200 mt-4 mr-2" value="button" title={__('Add Button', 'bit - integrations')} subTitle={__('Add Button')} />}

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'button'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Add Button', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />

        <div className="mt-3"><b>{__('Button Title:', 'bit-integrations')}</b></div>
        <input className="btcd-paper-inp mt-1" onChange={e => setChanges(e.target.value, 'selectedButtonTitle')} name="button_title" value={gravitecConf.selectedButtonTitle} type="text" placeholder={__('Button Title...', 'bit-integrations')} />

        <div className="mt-3"><b>{__('Button URL:', 'bit-integrations')}</b></div>
        <input className="btcd-paper-inp mt-1" onChange={e => setChanges(e.target.value, 'selectedButtonURL')} name="button_url" value={gravitecConf.selectedButtonURL} type="text" placeholder={__('Button URL...', 'bit-integrations')} />

      </ConfirmModal>

    </div>
  )
}

