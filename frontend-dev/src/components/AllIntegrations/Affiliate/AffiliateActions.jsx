/* eslint-disable no-param-reassign */

import { useState } from 'react'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import ConfirmModal from '../../Utilities/ConfirmModal'
import TableCheckBox from '../../Utilities/TableCheckBox'
import 'react-multiple-select-dropdown-lite/dist/index.css'

export default function AffiliateActions({ affiliateConf, setAffiliateConf, formFields }) {
  const [isLoading, setIsLoading] = useState(false)
  const [actionMdl, setActionMdl] = useState({ show: false, action: () => { } })
  const actionHandler = (e, type) => {
    const newConf = { ...affiliateConf }
    if (type === 'status') {
      if (e.target?.checked) {
        newConf.actions.status = true
        setActionMdl({ show: 'status' })
      } else {
        setActionMdl({ show: false })
        delete newConf.actions.status
      }
    } if (type === 'type') {
      if (e.target?.checked) {
        newConf.actions.type = true
        setActionMdl({ show: 'type' })
      } else {
        setActionMdl({ show: false })
        delete newConf.actions.type
      }
    }

    setAffiliateConf({ ...newConf })
  }
  const clsActionMdl = () => {
    setActionMdl({ show: false })
  }

  const changeHandler = (val, name) => {
    const newConf = { ...affiliateConf }
    newConf[name] = val
    setAffiliateConf({ ...newConf })
  }

  return (
    <div className="pos-rel d-flx w-8">
      <TableCheckBox checked={affiliateConf?.actions?.status || false} onChange={(e) => actionHandler(e, 'status')} className="wdt-200 mt-4 mr-2" value="status" title={__('Add Status', 'bit-integrations')} subTitle={__('Add Status ', 'bit-integrations')} />

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
        <div className="mt-2">{__('Select status of referral ', 'bit-integrations')}</div>
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
                defaultValue={affiliateConf?.statusId}
                options={affiliateConf?.allStatus.map((item) => ({ label: item.label, value: item.key }))}
                onChange={(val) => changeHandler(val, 'statusId')}
                singleSelect
              />
            </div>
          )}

      </ConfirmModal>

      <TableCheckBox checked={affiliateConf?.actions?.type || false} onChange={(e) => actionHandler(e, 'type')} className="wdt-200 mt-4 mr-2" value="type" title={__('Add Type', 'bit-integrations')} subTitle={__('Add Type', 'bit-integrations')} />

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'type'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Type', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />
        <div className="mt-2">{__('Select Type of referral', 'bit-integrations')}</div>
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
                defaultValue={affiliateConf?.referralId}
                options={affiliateConf.allReferralType.map((item) => ({ label: item.label, value: item.key }))}
                onChange={(val) => changeHandler(val, 'referralId')}
                singleSelect
              />
            </div>
          )}

      </ConfirmModal>

    </div>
  )
}
