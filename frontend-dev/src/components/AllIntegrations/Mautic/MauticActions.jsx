/* eslint-disable no-param-reassign */

import { useState } from 'react'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import ConfirmModal from '../../Utilities/ConfirmModal'
import TableCheckBox from '../../Utilities/TableCheckBox'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { getAllTags, getAllUsers } from './MauticCommonFunc'

export default function MauticActions({ mauticConf, setMauticConf, formFields }) {
  const [isLoading, setIsLoading] = useState(false)
  const [actionMdl, setActionMdl] = useState({ show: false, action: () => {} })
  const [snack, setSnackbar] = useState({ show: false })
  const actionHandler = (e, type) => {
    const newConf = { ...mauticConf }

    if (type === 'tag') {
      getAllTags(mauticConf, setMauticConf, setIsLoading, setSnackbar)
    } else if (type === 'owner') {
      getAllUsers(mauticConf, setMauticConf, setIsLoading, setSnackbar)
    }

    setActionMdl({ show: type })
    setMauticConf({ ...newConf })
  }
  const clsActionMdl = () => {
    setActionMdl({ show: false })
  }
  const setChange = (val, name) => {
    const newConf = { ...mauticConf }

    if (name === 'tag') {
      newConf.tag = val ? val.split(',') : []
    } else if (name === 'owner') {
      newConf.owner = val
    }

    setMauticConf({ ...newConf })
  }

  return (
    <div className="pos-rel d-flx w-8">
      <TableCheckBox
        checked={mauticConf?.tag?.length > 0 || false}
        onChange={(e) => actionHandler(e, 'tag')}
        className="wdt-200 mt-4 mr-2"
        value="tag"
        title={__('Add Tag', 'bit-integrations')}
        subTitle={__('Add tag to mautic contact', 'bit-integrations')}
      />
      <TableCheckBox
        checked={mauticConf?.owner || false}
        onChange={(e) => actionHandler(e, 'owner')}
        className="wdt-200 mt-4 mr-2"
        value="owner"
        title={__('Add Contact Owner', 'bit-integrations')}
        subTitle={__('Add a Owner to mautic contact', 'bit-integrations')}
      />

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="purple"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'tag'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Tag Records', 'bit-integrations')}>
        <div className="btcd-hr mt-2 mb-2" />
        <small>{__('Add a tag to contacts', 'bit-integrations')}</small>
        {isLoading ? (
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
              className="msl-wrp-options"
              defaultValue={mauticConf?.tag}
              options={mauticConf.default?.tags?.map((list) => ({
                label: list.tagName,
                value: list.tagName.toString()
              }))}
              onChange={(val) => setChange(val, 'tag')}
              customValue
            />
            <button
              onClick={() => getAllTags(mauticConf, setMauticConf, setIsLoading, setSnackbar)}
              className="icn-btn sh-sm ml-2 mr-2 tooltip"
              style={{ '--tooltip-txt': `${__('Refresh CRM Tags', 'bit-integrations')}'` }}
              type="button"
              disabled={isLoading}>
              &#x21BB;
            </button>
          </div>
        )}
      </ConfirmModal>
      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="purple"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'owner'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Contact Owner', 'bit-integrations')}>
        <div className="btcd-hr mt-2 mb-2" />
        <small>{__('Add a owner to contacts', 'bit-integrations')}</small>
        {isLoading ? (
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
              className="msl-wrp-options"
              defaultValue={mauticConf?.owner}
              options={mauticConf?.default?.users?.map((user) => ({
                label: user.label,
                value: user.id.toString()
              }))}
              onChange={(val) => setChange(val, 'owner')}
              singleSelect
              selectOnClose
            />
            <button
              onClick={() => getAllUsers(mauticConf, setMauticConf, setIsLoading, setSnackbar)}
              className="icn-btn sh-sm ml-2 mr-2 tooltip"
              style={{ '--tooltip-txt': `${__('Refresh Contact Owner', 'bit-integrations')}'` }}
              type="button"
              disabled={isLoading}>
              &#x21BB;
            </button>
          </div>
        )}
      </ConfirmModal>
    </div>
  )
}
