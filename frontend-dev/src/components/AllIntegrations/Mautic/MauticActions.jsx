/* eslint-disable no-param-reassign */

import { useState } from 'react'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import ConfirmModal from '../../Utilities/ConfirmModal'
import TableCheckBox from '../../Utilities/TableCheckBox'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { getAllTags } from './MauticCommonFunc'

export default function MauticActions({ mauticConf, setMauticConf, formFields }) {
  const [isLoading, setIsLoading] = useState(false)
  const [actionMdl, setActionMdl] = useState({ show: false, action: () => { } })
  const [snack, setSnackbar] = useState({ show: false })
  const actionHandler = (e, type) => {
    const newConf = { ...mauticConf }
    if (type === 'tag') {
      if (e.target.checked) {
        getAllTags(mauticConf, setMauticConf, setIsLoading, setSnackbar)
        newConf.actions.tag = true
        setActionMdl({ show: 'tag' })
      } else {
        setActionMdl({ show: false })
        delete newConf.actions.tag
      }
    }
    setMauticConf({ ...newConf })
  }
  const clsActionMdl = () => {
    setActionMdl({ show: false })
  }
  const setTags = (val) => {
    const newConf = { ...mauticConf }
    newConf.tag = val ? val.split(',') : []
    setMauticConf({ ...newConf })
  }


  return (

    <div className="pos-rel d-flx w-8">
      <TableCheckBox checked={mauticConf.actions?.tag || false} onChange={(e) => actionHandler(e, 'tag')} className="wdt-200 mt-4 mr-2" value="tag" title={__('Add Tag', 'bit-integrations')} subTitle={__('Add tag to mautic contact', 'bit-integrations')} />
      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'tag'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Tag Records', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />
        <small>{__('Add a tag to contacts', 'bit-integrations')}</small>
        <div className="mt-2">{__('Tag Name', 'bit-integrations')}</div>
        {isLoading
          ? (
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
                className="msl-wrp-options"
                defaultValue={mauticConf?.tag}
                options={mauticConf.default?.tags?.map(list => ({ label: list.tagName, value: list.tagName.toString() }))}
                onChange={val => setTags(val)}
                customValue
              />
              <button onClick={() => getAllTags(mauticConf, setMauticConf, setIsLoading, setSnackbar)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `${__('Refresh CRM Tags', 'bit-integrations')}'` }} type="button" disabled={isLoading}>&#x21BB;</button>
            </div>
          )}

      </ConfirmModal>

    </div>
  )
}
