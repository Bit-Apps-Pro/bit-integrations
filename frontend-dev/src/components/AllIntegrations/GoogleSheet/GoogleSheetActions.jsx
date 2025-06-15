/* eslint-disable no-param-reassign */

import { useEffect, useState } from 'react'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { __ } from '../../../Utils/i18nwrap'
import CheckBox from '../../Utilities/CheckBox'
import Modal from '../../Utilities/Modal'
import TableCheckBox from '../../Utilities/TableCheckBox'
import TitleModal from '../../Utilities/TitleModal'

export default function GoogleSheetActions({ sheetConf, setSheetConf, formFields }) {
  const [updateMdl, setUpdateMdl] = useState(false)
  const [actionMdl, setActionMdl] = useState({ show: false })

  const actionHandler = (val, typ) => {
    const newConf = { ...sheetConf }
    if (typ === 'update') {
      if (val.target.checked && !newConf?.actions?.update) {
        newConf.actions.update = { insert: true, criteria: '', firstMatch: false }
        setUpdateMdl(true)
      } else {
        delete newConf.actions.update
      }
    }

    setSheetConf({ ...newConf })
  }

  const handleShareSetting = (i, act, val) => {
    const newConf = { ...sheetConf }

    if (!newConf.actions?.share) newConf.actions.share = []

    newConf.actions.share[i][act] = val

    setSheetConf({ ...newConf })
  }

  const setUpdateSettings = (val, typ) => {
    const newConf = { ...sheetConf }
    newConf.actions.update[typ] = val
    setSheetConf({ ...newConf })
  }

  const openUpdateModal = () => {
    if (!sheetConf.actions?.update) {
      const newConf = { ...sheetConf }
      newConf.actions.update = { insert: true, criteria: '', firstMatch: false }
      setSheetConf({ ...newConf })
    }

    setUpdateMdl(true)
  }

  const openShareModal = () => {
    const newConf = { ...sheetConf }
    if (!newConf.actions.share) {
      newConf.actions.share = [
        { email: '', field: '', access: 'view', accessLabel: 'Read Only' },
        { email: '', field: '', access: 'view_and_comment', accessLabel: 'Read/Comment' },
        { email: '', field: '', access: 'edit', accessLabel: 'Read/Edit' },
        { email: '', field: '', access: 'share', accessLabel: 'Co-Owner' },
        { email: '', field: '', access: 'remove_share', accessLabel: 'Remove Share' },
      ]
    }
    setSheetConf({ ...newConf })
    setActionMdl({ show: 'share' })
  }

  const getUsers = () => {
    const arr = [
      { title: 'Form Fields', type: 'group', childs: [] },
    ]

    arr[0].childs = formFields.map(itm => ({ label: itm.name, value: `\${${itm.key}}` }))
    return arr
  }

  useEffect(() => {
    if (!updateMdl && !sheetConf.actions?.update?.criteria) {
      const newConf = { ...sheetConf }
      delete newConf.actions.update
      setSheetConf({ ...newConf })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateMdl])

  return (
    <div className="pos-rel">
      <div className="d-flx flx-wrp">
        {sheetConf.default?.worksheets?.headers?.[sheetConf.worksheet]?.[sheetConf.headerRow] && (
          <TitleModal action={openUpdateModal}>
            <TableCheckBox onChange={(e) => actionHandler(e, 'update')} checked={'update' in sheetConf?.actions} className="wdt-200 mt-4 mr-2" value="Upsert_Record" title={__('Update Row', 'bit-integrations')} subTitle={__('Control how the row gets updated.', 'bit-integrations')} />
          </TitleModal>
        )}

        <TableCheckBox onChange={openShareModal} checked={sheetConf?.actions?.share?.find(userShare => userShare.email) || false} className="wdt-200 mt-4 mr-2" value="user_share" title={__('Update google Sheet', 'bit-integrations')} subTitle={__('Update Responses with Google Sheet?', 'bit-integrations')} />
      </div>

      <Modal
        md
        show={updateMdl}
        setModal={setUpdateMdl}
        title={__('Update Row', 'bit-integrations')}
      >
        <div className="o-a">
          {sheetConf?.actions?.update && (
            <>
              <small>{__('Enter the criteria to update rows. Please use the below format.', 'bit-integrations')}</small>
              <br />
              <div className="mt-4">
                <small>
                  Example:&nbsp;
                  {'("Month"="March" or "Month"="April") and "Amount">30'}
                </small>
                <br />
                <small>Here Month and Amount are Zoho Sheet&apos;s worksheet header name</small>
                {' '}
                <span className="icn-btn ml-2 tooltip" style={{ '--tooltip-txt': '"Supported Relational Operators: =, !=, <, >, <=, >=, contains"', fontSize: 15 }}>
                  <span className="btcd-icn icn-information-outline" />
                </span>
                <textarea name="" rows="5" className="btcd-paper-inp mt-1" onChange={e => setUpdateSettings(e.target.value, 'criteria')} value={sheetConf.actions?.update?.criteria} />
              </div>

              <div className="font-w-m mt-3">{__('Update Preferance', 'bit-integrations')}</div>
              <small>{__('update row for first match only?', 'bit-integrations')}</small>
              <div>
                <CheckBox onChange={() => setUpdateSettings(true, 'firstMatch')} radio checked={sheetConf.actions.update?.firstMatch} name="firstMatch" title={__('Yes', 'bit-integrations')} />
                <CheckBox onChange={() => setUpdateSettings(false, 'firstMatch')} radio checked={!sheetConf.actions.update?.firstMatch} name="firstMatch" title={__('No', 'bit-integrations')} />
              </div>
              <small>{__('insert new row if the above criteria doesn\'t met?', 'bit-integrations')}</small>
              <div>
                <CheckBox onChange={() => setUpdateSettings(true, 'insert')} radio checked={sheetConf.actions.update?.insert} name="up-row" title={__('Yes', 'bit-integrations')} />
                <CheckBox onChange={() => setUpdateSettings(false, 'insert')} radio checked={!sheetConf.actions.update?.insert} name="up-row" title={__('No', 'bit-integrations')} />
              </div>
            </>
          )}
        </div>
      </Modal>

      <Modal
        md
        show={actionMdl.show === 'share'}
        setModal={() => setActionMdl({ show: false })}
        title={__('Share Settings', 'bit-integrations')}
      >
        <div className="o-a" style={{ height: '95%' }}>
          {sheetConf?.actions?.share?.length > 0 && sheetConf.actions.share.map((user, i) => (
            <div key={user.accessLabel} className="flx flx-between mt-2">
              <MultiSelect
                className="btcd-paper-drpdwn w-7 mr-2"
                placeholder="Input Email Address(s)"
                defaultValue={user.email}
                onChange={(e) => handleShareSetting(i, 'email', e)}
                options={getUsers()}
                customValue
              />
              <input className="btcd-paper-inp w-3" type="text" value={user.accessLabel} readOnly />
            </div>
          ))}
        </div>
      </Modal>

    </div>
  )
}
