/* eslint-disable no-param-reassign */

import { useState } from 'react'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import ConfirmModal from '../../Utilities/ConfirmModal'
import TableCheckBox from '../../Utilities/TableCheckBox'
//import { getAllTags } from './SmartSuiteCommonFunc'

export default function SmartSuiteActions({ smartSuiteConf, setSmartSuiteConf, loading, setLoading }) {
  const [actionMdl, setActionMdl] = useState({ show: false, action: () => {} })

  const actionHandler = (e, type) => {
    const newConf = { ...smartSuiteConf }
    if (type === 'tag') {
      if (e.target?.checked) {
        //   getAllTags(smartSuiteConf, setSmartSuiteConf, setLoading)
        newConf.actions.tag = true
      } else {
        setActionMdl({ show: false })
        delete newConf.actions.tag
      }
    }

    setActionMdl({ show: type })
    setSmartSuiteConf({ ...newConf })
  }

  const clsActionMdl = () => {
    setActionMdl({ show: false })
  }

  const setChanges = (val, name) => {
    const newConf = { ...smartSuiteConf }
    newConf[name] = val
    setSmartSuiteConf({ ...newConf })
  }

  return (
    <div className="pos-rel d-flx flx-wrp">
      {/* {smartSuiteConf.actionName === 'contact' && (
        <TableCheckBox
          checked={smartSuiteConf?.selectedTag?.length || false}
          onChange={(e) => actionHandler(e, 'tag')}
          className="wdt-200 mt-4 mr-2"
          value="tag"
          title={__('Add Tags', 'bit - integrations')}
          subTitle={__('Add tags')}
        />
      )} */}

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="purple"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'tag'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Tags', 'bit-integrations')}>
        <div className="btcd-hr mt-2 mb-2" />
        <div className="mt-2">{__('Select tag', 'bit-integrations')}</div>
        {loading.tags ? (
          <Loader
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 45,
              transform: 'scale(0.5)'
            }}
          />
        ) : (
          <div className="flx flx-between mt-2">
            <MultiSelect
              options={smartSuiteConf?.tags?.map((tag) => ({ label: tag.tag, value: tag.tag }))}
              className="msl-wrp-options"
              defaultValue={smartSuiteConf?.selectedTag}
              onChange={(val) => setChanges(val, 'selectedTag')}
            />
            <button
              /*  onClick={() => getAllTags(smartSuiteConf, setSmartSuiteConf, setLoading)} */
              className="icn-btn sh-sm ml-2 mr-2 tooltip"
              style={{ '--tooltip-txt': `${__('Refresh Tags', 'bit-integrations')}'` }}
              type="button">
              &#x21BB;
            </button>
          </div>
        )}
      </ConfirmModal>
    </div>
  )
}
