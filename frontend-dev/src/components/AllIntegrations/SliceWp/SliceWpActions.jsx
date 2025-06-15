/* eslint-disable no-param-reassign */

import { useState } from 'react'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import ConfirmModal from '../../Utilities/ConfirmModal'
import TableCheckBox from '../../Utilities/TableCheckBox'
import 'react-multiple-select-dropdown-lite/dist/index.css'

export default function SliceWpActions({ sliceWpConf, setSliceWpConf, formFields }) {
  const [isLoading, setIsLoading] = useState(false)
  const [actionMdl, setActionMdl] = useState({ show: false, action: () => { } })
  const status = [
    { key: 'pending', label: 'Pending' },
    { key: 'paid', label: 'Paid' },
    { key: 'unpaid', label: 'Unpaid' },
    { key: 'rejected', label: 'Rejected' },
  ]

  const types = [
    { key: 'sale', label: 'Sale' },
    { key: 'subscription', label: 'Subscription' },
  ]

  const actionHandler = (e, typeName) => {
    const newConf = { ...sliceWpConf }
    if (typeName === 'status') {
      if (e.target?.checked) {
        newConf.actions.status = true
        setActionMdl({ show: 'status' })
      } else {
        setActionMdl({ show: false })
        delete newConf.actions.status
      }
    } if (typeName === 'types') {
      if (e.target?.checked) {
        newConf.actions.types = true
        setActionMdl({ show: 'types' })
      } else {
        setActionMdl({ show: false })
        delete newConf.actions.types
      }
    }

    setSliceWpConf({ ...newConf })
  }
  const clsActionMdl = () => {
    setActionMdl({ show: false })
  }

  const changeHandler = (val, name) => {
    const newConf = { ...sliceWpConf }
    if (name === 'statusId') {
      if (val !== '') {
        newConf[name] = val
      } else {
        delete newConf[name]
      }
    }
    if (name === 'typeId') {
      if (val !== '') {
        newConf[name] = val
      } else {
        delete newConf[name]
      }
    }
    setSliceWpConf({ ...newConf })
  }

  return (
    <div className="pos-rel d-flx w-8">
      <TableCheckBox checked={sliceWpConf?.actions?.status || false} onChange={(e) => actionHandler(e, 'status')} className="wdt-200 mt-4 mr-2" value="status" title={__('Add Status', 'bit-integrations')} subTitle={__('Add status of SliceWp', 'bit-integrations')} />

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'status'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Status', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />
        <div className="mt-2">{__('Select Status ', 'bit-integrations')}</div>
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
                defaultValue={sliceWpConf?.statusId}
                options={status.map((item) => ({ label: item.label, value: item.key }))}
                onChange={(val) => changeHandler(val, 'statusId')}
                singleSelect
              />
            </div>
          )}

      </ConfirmModal>

      <TableCheckBox checked={sliceWpConf?.actions?.types || false} onChange={(e) => actionHandler(e, 'types')} className="wdt-200 mt-4 mr-2" value="types" title={__('Add Type', 'bit-integrations')} subTitle={__('Add Type', 'bit-integrations')} />

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'types'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Type', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />
        <div className="mt-2">{__('Select Type', 'bit-integrations')}</div>
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
                defaultValue={sliceWpConf?.typeId}
                options={types.map((item) => ({ label: item.label, value: item.key }))}
                onChange={(val) => changeHandler(val, 'typeId')}
                singleSelect
              />
            </div>
          )}

      </ConfirmModal>

    </div>
  )
}
