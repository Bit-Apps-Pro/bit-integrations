/* eslint-disable no-param-reassign */

import { useState } from 'react'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { __ } from '../../../Utils/i18nwrap'
import ConfirmModal from '../../Utilities/ConfirmModal'
import TableCheckBox from '../../Utilities/TableCheckBox'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import Cooltip from '../../Utilities/Cooltip'

export default function MailBlusterActions({ mailBlusterConf, setMailBlusterConf }) {
  const [actionMdl, setActionMdl] = useState({ show: false, action: () => { } })
  const actionHandler = (e, type) => {
    const newConf = { ...mailBlusterConf }
    if (type === 'tag') {
      if (e.target?.checked) {
        newConf.actions.tags = true
      } else {
        setActionMdl({ show: false })
        delete newConf.actions.tags
      }
      setActionMdl({ show: 'tag' })
    }
    if (type === 'update') {
      if (e.target.checked) {
        newConf.actions.update = true
      } else {
        delete newConf.actions.update
      }
    }
    if (type === 'doubleOptIn') {
      if (e.target.checked) {
        newConf.actions.doubleOptIn = true
      } else {
        delete newConf.actions.doubleOptIn
      }
    }
    setMailBlusterConf({ ...newConf })
  }

  const clsActionMdl = () => {
    setActionMdl({ show: false })
  }

  const setChanges = (val) => {
    const newConf = { ...mailBlusterConf }
    newConf.selectedTags = val
    setMailBlusterConf({ ...newConf })
  }

  return (
    <div className="pos-rel d-flx w-8">
      <TableCheckBox
        checked={mailBlusterConf?.selectedTags.length || false}
        onChange={(e) => actionHandler(e, 'tag')}
        className="wdt-200 mt-4 mr-2"
        value="tag"
        title={__('Add Tags', 'bit - integrations')}
        subTitle={__('Note: If tag already exists, it will be only attached to the lead. Otherwise, it will be created first and then get attached.', 'bit - integrations')}
      />
      <TableCheckBox checked={mailBlusterConf.actions?.update || false} onChange={(e) => actionHandler(e, 'update')} className="wdt-200 mt-4 mr-2" value="update_contact" title={__('Update Lead', 'bit-integrations')} subTitle={__('Override the existing lead info by responses.', 'bit-integrations')} />
      <TableCheckBox checked={mailBlusterConf.actions?.doubleOptIn || false} onChange={(e) => actionHandler(e, 'doubleOptIn')} className="wdt-200 mt-4 mr-2" value="doubleOptIn" title={__('Double Opt-in', 'bit-integrations')} subTitle={__('Add Double Opt-in', 'bit-integrations')} />
      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'tag'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Tags', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />
        <div className="mt-2 ml-7 flx">
          {__('Create contact Tags', 'bit-integrations')}
          <Cooltip Cooltip width={250} icnSize={17} className="ml-2 mr-18">
            <div className="txt-body">
              Note: create custom options by pressing enter or comma.
              <br />
            </div>
          </Cooltip>
        </div>
        <div className="flx flx-center mt-2">
          <MultiSelect
            options=""
            className="msl-wrp-options"
            defaultValue={mailBlusterConf?.selectedTags}
            onChange={val => setChanges(val)}
            customValue
          />
        </div>
      </ConfirmModal>
    </div>
  )
}
