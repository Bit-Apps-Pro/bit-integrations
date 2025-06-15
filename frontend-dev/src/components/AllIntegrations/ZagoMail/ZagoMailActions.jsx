/* eslint-disable no-param-reassign */
// eslint-disable-next-line import/no-extraneous-dependencies
import { __ } from '../../../Utils/i18nwrap'
import TableCheckBox from '../../Utilities/TableCheckBox'
import { useState } from 'react'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import ConfirmModal from '../../Utilities/ConfirmModal'
import { refreshZagoMailTags } from './ZagoMailCommonFunc'
import Loader from '../../Loaders/Loader'

export default function ZagoMailActions({
  zagoMailConf,
  setZagoMailConf,
  isLoading,
  setIsLoading
}) {
  const [actionMdl, setActionMdl] = useState({ show: false, action: () => {} })
  const actionHandler = (e, type) => {
    const newConf = { ...zagoMailConf }
    if (type === 'tag') {
      if (e.target?.checked) {
        refreshZagoMailTags(zagoMailConf, setZagoMailConf, setIsLoading)
        newConf.actions.tags = true
      } else {
        setActionMdl({ show: false })
        delete newConf.actions.tags
      }
      setActionMdl({ show: 'tag' })
    }
    if (type === 'update') {
      if (e.target.checked) {
        newConf.actions.update = true
      } else {
        delete newConf.actions.update
      }
    }
    setZagoMailConf({ ...newConf })
  }

  const clsActionMdl = () => {
    setActionMdl({ show: false })
  }

  const setChanges = (val) => {
    const newConf = { ...zagoMailConf }
    newConf.selectedTags = val
    setZagoMailConf({ ...newConf })
  }
  return (
    <div className="pos-rel d-flx w-8">
      <TableCheckBox
        checked={zagoMailConf?.selectedTags.length || false}
        onChange={(e) => actionHandler(e, 'tag')}
        className="wdt-200 mt-4 mr-2"
        value="tags"
        title={__('Add Tags', 'bit - integrations')}
        subTitle={__('Selects tags for contact')}
      />
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
        <div className="mt-2">{__('Select tags', 'bit-integrations')}</div>
        {isLoading.tags ? (
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
              options={zagoMailConf?.tags?.map((tag) => ({ label: tag.tagName, value: tag.tagId }))}
              className="msl-wrp-options"
              defaultValue={zagoMailConf?.selectedTags}
              onChange={(val) => setChanges(val)}
            />
            <button
              onClick={() => refreshZagoMailTags(zagoMailConf, setZagoMailConf, setIsLoading)}
              className="icn-btn sh-sm ml-2 mr-2 tooltip"
              style={{ '--tooltip-txt': `${__('Refresh Groups', 'bit-integrations')}'` }}
              type="button">
              &#x21BB;
            </button>
          </div>
        )}
      </ConfirmModal>
      <TableCheckBox
        checked={zagoMailConf.actions?.update || false}
        onChange={(e) => actionHandler(e, 'update')}
        className="wdt-200 mt-4 mr-2"
        value="user_share"
        title={__('Update ZagoMail', 'bit-integrations')}
        subTitle={__('Update Responses with ZagoMail existing email?', 'bit-integrations')}
      />
    </div>
  )
}
