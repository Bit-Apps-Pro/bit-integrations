/* eslint-disable no-param-reassign */

import { useState } from 'react'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { __ } from '../../../Utils/i18nwrap'
import TableCheckBox from '../../Utilities/TableCheckBox'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import ConfirmModal from '../../Utilities/ConfirmModal'
import Loader from '../../Loaders/Loader'
import { getLists } from './SendGridCommonFunc'

export default function SendGridActions({ sendGridConf, setSendGridConf, loading, setLoading }) {
  const [actionMdl, setActionMdl] = useState({ show: false, action: () => { } })

  const actionHandler = (e) => {
    const newConf = { ...sendGridConf }
    if (e.target.checked) {
      getLists(sendGridConf, setSendGridConf, setLoading)
      newConf.actions.lists = true
    } else {
      setActionMdl({ show: false })
      delete newConf.actions.lists
    }
    setActionMdl({ show: 'lists' })
    setSendGridConf({ ...newConf })
  }

  const clsActionMdl = () => {
    setActionMdl({ show: false })
  }

  const setChanges = (val) => {
    const newConf = { ...sendGridConf }
    newConf.selectedLists = val
    setSendGridConf({ ...newConf })
  }

  return (
    <div className="pos-rel d-flx w-8">
      <TableCheckBox checked={sendGridConf?.selectedLists?.length || false} onChange={(e) => actionHandler(e)} className="wdt-200 mt-4 mr-2" value="add_to_lists" title={__('Select Lists', 'bit-integrations')} subTitle={__('Add contact to lists')} />
      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'lists'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Lists', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />
        <div className="mt-2">{__('Select contact lists', 'bit-integrations')}</div>
        {
          loading.lists ? (
            <Loader style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 45,
              transform: 'scale(0.5)',
            }}
            />
          )
            : (
              <div className="flx flx-between mt-2">
                <MultiSelect
                  options={sendGridConf?.lists?.map(list => ({ label: list.name, value: list.id }))}
                  className="msl-wrp-options"
                  defaultValue={sendGridConf?.selectedLists}
                  onChange={val => setChanges(val)}
                />
                <button onClick={() => getLists(sendGridConf, setSendGridConf, setLoading)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `${__('Refresh Lists', 'bit-integrations')}'` }} type="button">&#x21BB;</button>
              </div>
            )
        }
      </ConfirmModal>
    </div>
  )
}
