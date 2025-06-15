/* eslint-disable no-param-reassign */

import { useState } from 'react'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import ConfirmModal from '../../Utilities/ConfirmModal'
import TableCheckBox from '../../Utilities/TableCheckBox'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { SmartTagField } from '../../../Utils/StaticData/SmartTagField'
import { fetchAllTags } from './GroundhoggCommonFunc'
import TitleModal from '../../Utilities/TitleModal'

export default function GroundhoggActions({ groundhoggConf, setGroundhoggConf, formFields }) {
  const [isLoading, setIsLoading] = useState(false)
  const [actionMdl, setActionMdl] = useState({ show: false, action: () => { } })
  const actionHandler = (e, type) => {
    const newConf = { ...groundhoggConf }
    if (type === 'tag') {
      if (e.target?.checked) {
        newConf.actions.tags = true
      } else {
        delete newConf.actions.tags
      }
    }
    if (type === 'optin_status_open') {
      if (e.target?.checked) {
        newConf.optin_status_open = true
      } else {
        delete newConf.optin_status_open
      }
    }

    setGroundhoggConf({ ...newConf })
  }
  const clsActionMdl = () => {
    setActionMdl({ show: false })
  }
  const onSelectHandler = (val) => {
    const newConf = { ...groundhoggConf }
    if (val) {
      newConf.actions.tags = val
    } else {
      delete newConf.actions.tags
    }

    setGroundhoggConf({ ...newConf })
  }
  const onSelectOptionStatusHandler = (val) => {
    const newConf = { ...groundhoggConf }
    if (val) {
      newConf.optin_status = val
    } else {
      newConf.optin_status = '1'
    }

    setGroundhoggConf({ ...newConf })
  }

  const openReminderMdl = () => {
    setActionMdl({ show: 'tag' })
  }
  const openOptionStatusMdl = () => {
    setActionMdl({ show: 'optin_status' })
  }

  // eslint-disable-next-line camelcase
  const organizedTags = (groundhoggConf?.default?.tags || []).map(({ tag_name }) => ({ label: tag_name, value: `ground-${tag_name}` }))

  const options = [
    { type: 'group', title: 'Groundhogg Tags', childs: organizedTags },
    { type: 'group', title: 'Form Fields', childs: formFields.map(fld => ({ label: fld.label, value: fld.name })) },
    { type: 'group', title: 'Special Tags', childs: SmartTagField?.map(fld => ({ label: fld.label, value: fld.name })) },
  ]

  const optinStatusOptions = [
    { label: 'Unconfirmed', value: '1' },
    { label: 'Confirmed', value: '2' },
    { label: 'Unsubscribed', value: '3' },
    { label: 'Weekly', value: '4' },
    { label: 'Monthly', value: '5' },
    { label: 'Bounced', value: '6' },
    { label: 'Spam', value: '7' },
    { label: 'Complained', value: '8' },

  ]

  return (
    <div className="d-flx wdt-300">

      <div className="pos-rel d-flx w-8">
        <TitleModal action={openReminderMdl}>
          <TableCheckBox checked={groundhoggConf?.actions?.tags || false} onChange={(e) => actionHandler(e, 'tag')} className="wdt-200 mt-4 mr-2" value="tags" title={__('Add Tags', 'bit-integrations')} subTitle={__('Add Contact Tag', 'bit-integrations')} />
        </TitleModal>
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
          <div className="mt-2">{__('Select tag', 'bit-integrations')}</div>
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
                  options={options}
                  className="msl-wrp-options"
                  defaultValue={groundhoggConf.actions?.tags}
                  onChange={val => onSelectHandler(val)}
                  customValue
                />
                <button onClick={() => fetchAllTags(null, groundhoggConf, setGroundhoggConf, setIsLoading, null)} className="icn-btn sh-sm ml-2 mr-4 tooltip" style={{ '--tooltip-txt': `'${__('Refresh Groundhogg Tags', 'bit-integrations')}'` }} type="button" disabled={isLoading}>&#x21BB;</button>
              </div>
            )}

        </ConfirmModal>
      </div>
      <div className="pos-rel d-flx w-8">
        <TitleModal action={openOptionStatusMdl}>
          <TableCheckBox checked={groundhoggConf?.optin_status_open || false} onChange={(e) => actionHandler(e, 'optin_status_open')} className="wdt-200 mt-4 mr-2" value="optin_status_open" title={__('Optin Status ', 'bit-integrations')} subTitle={__('Add optin status ', 'bit-integrations')} />
        </TitleModal>
        <ConfirmModal
          className="custom-conf-mdl"
          mainMdlCls="o-v"
          btnClass="blue"
          btnTxt={__('Ok', 'bit-integrations')}
          show={actionMdl.show === 'optin_status'}
          close={clsActionMdl}
          action={clsActionMdl}
          title={__('Optin status', 'bit-integrations')}
        >
          <div className="btcd-hr mt-2 mb-2" />
          <div className="mt-2">{__('Select Optin status', 'bit-integrations')}</div>
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
                  options={optinStatusOptions}
                  className="msl-wrp-options"
                  defaultValue={groundhoggConf.optin_status}
                  onChange={val => onSelectOptionStatusHandler(val)}
                  singleSelect
                />
              </div>
            )}

        </ConfirmModal>

      </div>
    </div>
  )
}
