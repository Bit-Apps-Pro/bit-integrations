/* eslint-disable no-param-reassign */

import { useState } from 'react'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { __ } from '../../../Utils/i18nwrap'
import ConfirmModal from '../../Utilities/ConfirmModal'
import TableCheckBox from '../../Utilities/TableCheckBox'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import Loader from '../../Loaders/Loader'

export default function ClickupActions({ clickupConf, setClickupConf, loading, setLoading }) {
  const [actionMdl, setActionMdl] = useState({ show: false, action: () => { } })

  const followUps = [
    { label: 'Yes', value: 'yes' },
    { label: 'No', value: 'no' },
  ]

  const taskTypes = [
    { label: 'New Business', value: 'New Business' },
    { label: 'Existing Business', value: 'Existing Business' },
  ]

  const actionHandler = (e, type) => {
    const newConf = { ...clickupConf }

    if (type === 'tag') {
      if (e.target?.checked) {
        getAllTags(clickupConf, setClickupConf, setLoading)
        newConf.actions.tag = true
      } else {
        setActionMdl({ show: false })
        delete newConf.actions.tag
      }
    }

    setActionMdl({ show: type })
    setClickupConf({ ...newConf })
  }

  const clsActionMdl = () => {
    setActionMdl({ show: false })
  }

  const setChanges = (val, name) => {
    const newConf = { ...clickupConf }
    newConf[name] = val
    setClickupConf({ ...newConf })
  }


  return (
    <div className="pos-rel d-flx flx-wrp">
      {(clickupConf.actionName === 'task') && <TableCheckBox checked={clickupConf?.selectedTag?.length || false} onChange={(e) => actionHandler(e, 'tag')} className="wdt-200 mt-4 mr-2" value="tag" title={__('Add Tag', 'bit - integrations')} subTitle={__('Add an tag')} />}
      {/* {(clickupConf.actionName === 'deal') && <TableCheckBox checked={clickupConf?.selectedTeam?.length || false} onChange={(e) => actionHandler(e, 'team')} className="wdt-200 mt-4 mr-2" value="team" title={__('Add Team', 'bit - integrations')} subTitle={__('Add an team')} />} */}
      {/* {(clickupConf.actionName === 'task') && <TableCheckBox checked={clickupConf?.selectedCurrency?.length || false} onChange={(e) => actionHandler(e, 'currency')} className="wdt-200 mt-4 mr-2" value="currency" title={__('Add Currency', 'bit - integrations')} subTitle={__('Add a currency')} />} */}
      {/* {(clickupConf.actionName === 'deal') && <TableCheckBox checked={clickupConf?.selectedStage?.length || false} onChange={(e) => actionHandler(e, 'stage')} className="wdt-200 mt-4 mr-2" value="stage" title={__('Add Stage', 'bit - integrations')} subTitle={__('Add a stage')} />} */}

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
        <div className="mt-2">
          {__('Select Tag', 'bit-integrations')}
        </div>

        {
          loading.tags ? (
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
                  options={clickupConf?.tags?.map(tag => ({ label: tag.name, value: tag.id }))}
                  className="msl-wrp-options"
                  defaultValue={clickupConf?.selectedTag}
                  onChange={val => setChanges(val, 'selectedTag')}
                  singleSelect
                />
                <button onClick={() => getAllTags(clickupConf, setClickupConf, setLoading)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `${__('Refresh Tags', 'bit-integrations')}'` }} type="button">&#x21BB;</button>
              </div>
            )
        }
      </ConfirmModal>

    </div>
  )
}
