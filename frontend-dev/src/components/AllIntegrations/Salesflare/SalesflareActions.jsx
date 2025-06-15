/* eslint-disable no-param-reassign */

import { useState } from 'react'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import ConfirmModal from '../../Utilities/ConfirmModal'
import TableCheckBox from '../../Utilities/TableCheckBox'
import { getAllTags } from './SalesflareCommonFunc'

export default function SalesflareActions({ salesflareConf, setSalesflareConf, loading, setLoading }) {
  const [actionMdl, setActionMdl] = useState({ show: false, action: () => { } })

  const actionHandler = (e, type) => {
    const newConf = { ...salesflareConf }
    if (type === 'tags') {
      if (e.target?.checked) {
        newConf.actions.tags = true
        getAllTags(salesflareConf, setSalesflareConf, setLoading)
      } else {
        setActionMdl({ show: false })
        delete newConf.actions.tags
      }
    }

    setActionMdl({ show: type })
    setSalesflareConf({ ...newConf })
  }

  const clsActionMdl = () => {
    setActionMdl({ show: false })
  }

  const setChanges = (val, name) => {
    const newConf = { ...salesflareConf }
    newConf[name] = val
    setSalesflareConf({ ...newConf })
  }

  return (
    <div className="pos-rel d-flx flx-wrp">
      {salesflareConf.actionName && <TableCheckBox checked={salesflareConf?.selectedTags || false} onChange={(e) => actionHandler(e, 'tags')} className="wdt-200 mt-4 mr-2" value="tags" title={__('Add Tags', 'bit-integrations')} subTitle={__('Add Tags', 'bit-integrations')} />}

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'tags'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Add Tags', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />
        <div className="mt-2">
          {__('Select Tags', 'bit-integrations')}
        </div>

        {
          loading.tags ? (
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
                  options={salesflareConf?.tags?.map(tag => ({ label: tag, value: tag }))}
                  className="msl-wrp-options"
                  defaultValue={salesflareConf?.selectedTags}
                  onChange={val => setChanges(val, 'selectedTags')}
                />
                <button onClick={() => getAllTags(salesflareConf, setSalesflareConf, setLoading)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `${__('Refresh Tags', 'bit-integrations')}'` }} type="button">&#x21BB;</button>
              </div>
            )
        }
      </ConfirmModal>

    </div>
  )
}

