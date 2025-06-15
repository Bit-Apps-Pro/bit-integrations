/* eslint-disable no-param-reassign */

import { useState } from 'react'
import { __ } from '../../../Utils/i18nwrap'
import ConfirmModal from '../../Utilities/ConfirmModal'
import TableCheckBox from '../../Utilities/TableCheckBox'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import Cooltip from '../../Utilities/Cooltip'
import { mailsterLists, mailsterTags } from './MailsterCommonFunc'
import Loader from '../../Loaders/Loader'

export default function MailsterActions({ mailsterConf, setMailsterConf, loading, setLoading }) {
  const [actionMdl, setActionMdl] = useState({ show: false })
  const actionHandler = (e, type) => {
    const newConf = { ...mailsterConf }
    if (type === 'status') {
      setActionMdl({ show: 'status' })
    }

    if (type === 'lists') {
      setActionMdl({ show: 'lists' })
      mailsterLists(mailsterConf, setMailsterConf, loading, setLoading)
    }

    if (type === 'tags') {
      setActionMdl({ show: 'tags' })
      mailsterTags(mailsterConf, setMailsterConf, loading, setLoading)
    }

    setMailsterConf({ ...newConf })
  }

  const clsActionMdl = () => {
    setActionMdl({ show: false })
  }

  const setChanges = (val, type) => {
    const newConf = { ...mailsterConf }
    newConf[type] = val
    setMailsterConf({ ...newConf })
  }

  return (
    <div className="pos-rel d-flx w-8">
      <TableCheckBox
        checked={mailsterConf?.selectedStatus || false}
        onChange={(e) => actionHandler(e, 'status')}
        className="wdt-200 mt-4 mr-2"
        value="status"
        title={__('Status', 'bit-integrations')}
        subTitle={__('Set the subscriber status', 'bit-integrations')}
      />
      <TableCheckBox
        checked={mailsterConf.selectedLists || false}
        onChange={(e) => actionHandler(e, 'lists')}
        className="wdt-200 mt-4 mr-2"
        value="select_lists"
        title={__('Select Lists', 'bit-integrations')}
        subTitle={__('Choose which lists to add subscribers to.', 'bit-integrations')}
      />
      <TableCheckBox
        checked={mailsterConf.selectedTags || false}
        onChange={(e) => actionHandler(e, 'tags')}
        className="wdt-200 mt-4 mr-2"
        value="select_tags"
        title={__('Select tags', 'bit-integrations')}
        subTitle={__('Choose which tags to add to subscribers.', 'bit-integrations')}
      />
      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="purple"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'status'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Status', 'bit-integrations')}>
        <div className="btcd-hr mt-2 mb-2" />
        <div className="mt-2 flx">
          {__('Select subscriber status', 'bit-integrations')}
          <Cooltip width={250} icnSize={17} className="ml-1">
            <div className="txt-body">If omitted, the status will be set to "Subscribed".</div>
          </Cooltip>
        </div>
        <div className="mt-2">
          <MultiSelect
            options={[
              { label: __('Pending', 'bit-integrations'), value: '0' },
              { label: __('Subscribed', 'bit-integrations'), value: '1' },
              { label: __('Unsubscribed', 'bit-integrations'), value: '2' },
              { label: __('Hardbounced', 'bit-integrations'), value: '3' }
            ]}
            className="msl-wrp-options"
            defaultValue={mailsterConf?.selectedStatus}
            onChange={(val) => setChanges(val, 'selectedStatus')}
            singleSelect
            style={{ width: '100%' }}
          />
        </div>
      </ConfirmModal>
      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'lists'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Lists', 'bit-integrations')}>
        <div className="btcd-hr mt-2 mb-2" />
        <div className="mt-2 flx">
          {__('Select Lists', 'bit-integrations')}
          <Cooltip width={250} icnSize={17} className="ml-1">
            <div className="txt-body">
              {__('Subscribers will be associated with the selected lists', 'bit-integrations')}
            </div>
          </Cooltip>
        </div>
        {loading.lists ? (
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
          <div className="mt-2">
            <MultiSelect
              options={mailsterConf.lists}
              className="msl-wrp-options"
              defaultValue={mailsterConf?.selectedLists}
              onChange={(val) => setChanges(val, 'selectedLists')}
              style={{ width: '100%' }}
            />
          </div>
        )}
      </ConfirmModal>
      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'tags'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Tags', 'bit-integrations')}>
        <div className="btcd-hr mt-2 mb-2" />
        <div className="mt-2 flx">
          {__('Select tags', 'bit-integrations')}
          <Cooltip width={300} icnSize={17} className="ml-1">
            <div className="txt-body">
              {__(
                'Selected tags will be associated with the subscriber. You can also add custom tags by pressing enter or comma (,) after writing them',
                'bit-integrations'
              )}
            </div>
          </Cooltip>
        </div>
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
          <div className="mt-2">
            <MultiSelect
              options={mailsterConf.tags}
              className="msl-wrp-options"
              defaultValue={mailsterConf?.selectedTags}
              onChange={(val) => setChanges(val, 'selectedTags')}
              style={{ width: '100%' }}
              customValue
            />
          </div>
        )}
      </ConfirmModal>
    </div>
  )
}
