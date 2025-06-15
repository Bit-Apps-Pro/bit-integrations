/* eslint-disable no-param-reassign */

import { useState } from 'react'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { __ } from '../../../Utils/i18nwrap'
import ConfirmModal from '../../Utilities/ConfirmModal'
import TableCheckBox from '../../Utilities/TableCheckBox'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import Loader from '../../Loaders/Loader'

export default function ClickupActions({
  clickupConf,
  setClickupConf,
  formFields,
  loading,
  setLoading
}) {
  const [actionMdl, setActionMdl] = useState({ show: false, action: () => {} })

  const clsActionMdl = () => {
    setActionMdl({ show: false })
  }

  const setChanges = (val, name) => {
    const newConf = { ...clickupConf }
    newConf[name] = val
    setClickupConf({ ...newConf })
  }

  return (
    <div className="pos-rel d-flx flx-wrp">
      {
        <TableCheckBox
          checked={clickupConf?.attachment || false}
          onChange={() => setActionMdl({ show: 'attachment' })}
          className="wdt-200 mt-4 mr-2"
          value="attachment"
          title={__('Add Attachment', 'bit - integrations')}
          subTitle={__('Add attachment in the task')}
        />
      }

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="purple"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'attachment'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Select file upload field', 'bit-integrations')}>
        <div className="btcd-hr mt-2" />
        <div className="mt-2">{__('Select file upload field', 'bit-integrations')}</div>
        <MultiSelect
          defaultValue={clickupConf?.attachment}
          className="mt-2 w-9"
          onChange={(val) => setChanges(val, 'attachment')}
          options={formFields
            .filter((itm) => itm.type === 'file')
            .map((itm) => ({ label: itm.label, value: itm.name }))}
          closeOnSelect
        />
      </ConfirmModal>
    </div>
  )
}
