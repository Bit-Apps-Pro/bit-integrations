/* eslint-disable no-param-reassign */

import { useState } from 'react'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import ConfirmModal from '../../Utilities/ConfirmModal'
import TableCheckBox from '../../Utilities/TableCheckBox'
import 'react-multiple-select-dropdown-lite/dist/index.css'

export default function OmniSendActions({ omniSendConf, setOmniSendConf, formFields, loading, setLoading }) {
  const [actionMdl, setActionMdl] = useState({ show: false, action: () => { } })
  const actionHandler = (e, type) => {
    const newConf = { ...omniSendConf }
    if (type === 'tag') {
      if (e.target.checked) {
        newConf.actions.tag = true
      } else {
        delete newConf.actions.tag
      }
      setActionMdl({ show: type })
    }

    setOmniSendConf({ ...newConf })
  }
  const clsActionMdl = () => {
    setActionMdl({ show: false })
  }

  const setChanges = (val, type) => {
    const newConf = { ...omniSendConf }
    if (type === 'selected_tags' && val.length) {
      newConf.actions.selected_tags = true
    } else if (type === 'selected_tags' && val.length < 1) {
      delete newConf.actions.selected_tags
    }
    newConf[type] = val
    setOmniSendConf({ ...newConf })
  }

  return (
    <>
      <div className="pos-rel d-flx w-8">
        <TableCheckBox checked={omniSendConf?.actions.tag || false} onChange={(e) => actionHandler(e, 'tag')} className="wdt-200 mt-4 mr-2" value="tags" title={__('Tags', 'bit-integrations')} subTitle={__('Add Custom Tags', 'bit-integrations')} />
      </div>

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'tag'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Add Custom Tags', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />

        <div className="flx flx-between mt-2">
          <MultiSelect
            className="msl-wrp-options"
            defaultValue={omniSendConf?.selected_tags}
            options={[]}
            onChange={val => setChanges(val, 'selected_tags')}
            customValue
          />
        </div>

      </ConfirmModal>

    </>

  )
}
