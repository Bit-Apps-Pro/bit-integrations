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
  const colorPicker = [
    { key: 'Primary Blue', value: '#3A86FF' },
    { key: 'Primary Light Blue', value: '#4ECCFD' },
    { key: 'Primary Green', value: '#3EAC40' },
    { key: 'Primary Red', value: '#FF5757' },
    { key: 'Primary Orange', value: '#FF9210' },
    { key: 'Primary Yellow', value: '#FFB938' },
    { key: 'Primary Purple', value: '#883CD0' },
    { key: 'Primary Pink', value: '#EC506E' },
    { key: 'Primary Teal', value: '#17C4C4' },
    { key: 'Primary Grey', value: '#6A849B' },
    { key: 'Dark Primary Blue', value: '#0C41F3' },
    { key: 'Dark Primary Light Blue', value: '#00B3FA' },
    { key: 'Dark Primary Green', value: '#199A27' },
    { key: 'Dark Primary Red', value: '#F1273F' },
    { key: 'Dark Primary Orange', value: '#FF702E' },
    { key: 'Dark Primary Yellow', value: '#FDA80D' },
    { key: 'Dark Primary Purple', value: '#673DB6' },
    { key: 'Dark Primary Pink', value: '#CD286A' },
    { key: 'Dark Primary Teal', value: '#00B2A8' },
    { key: 'Dark Primary Grey', value: '#50515B' }
  ]
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
      {smartSuiteConf.actionName != 'contact' && (
        <TableCheckBox
          checked={smartSuiteConf?.selectedTag?.length || false}
          onChange={(e) => actionHandler(e, 'tag')}
          className="wdt-200 mt-4 mr-2"
          value="tag"
          title={__('Add Logo Color', 'bit - integrations')}
          subTitle={__('Logo Color for solutions')}
        />
      )}

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="purple"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'tag'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Logo Color', 'bit-integrations')}>
        <div className="btcd-hr mt-2 mb-2" />
        <div className="mt-2">{__('Select Logo Color', 'bit-integrations')}</div>
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
              options={colorPicker.map((color) => ({ label: color.key, value: color.value }))}
              className="msl-wrp-options"
              defaultValue={smartSuiteConf?.selectedTag}
              onChange={(val) => setChanges(val, 'selectedTag')}
              selectOnClose
              singleSelect
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
