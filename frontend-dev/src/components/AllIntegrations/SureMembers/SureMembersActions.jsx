/* eslint-disable no-param-reassign */

import { useState } from 'react'
import { __ } from '../../../Utils/i18nwrap'
import ConfirmModal from '../../Utilities/ConfirmModal'
import TableCheckBox from '../../Utilities/TableCheckBox'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import Cooltip from '../../Utilities/Cooltip'
import { getSureMembersGroups } from './SureMembersCommonFunc'
import Loader from '../../Loaders/Loader'

export default function SureMembersActions({
  sureMembersConf,
  setSureMembersConf,
  loading,
  setLoading
}) {
  const [actionMdl, setActionMdl] = useState({ show: false })
  const actionHandler = (e) => {
    getSureMembersGroups(sureMembersConf, setSureMembersConf, setLoading)
    const newConf = { ...sureMembersConf }
    setActionMdl({ show: 'group' })
    setSureMembersConf({ ...newConf })
  }

  const clsActionMdl = () => {
    setActionMdl({ show: false })
  }

  const setChanges = (val, type) => {
    const newConf = { ...sureMembersConf }
    newConf[type] = val
    setSureMembersConf({ ...newConf })
  }

  return (
    <div className="pos-rel d-flx w-8">
      <TableCheckBox
        checked={sureMembersConf.selectedGroup || false}
        onChange={(e) => actionHandler(e)}
        className="wdt-200 mt-4 mr-2"
        value="select_group"
        title={__('Select group', 'bit-integrations')}
        subTitle={__('Select a group to grant or revoke access.', 'bit-integrations')}
      />
      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'group'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('Groups', 'bit-integrations')}>
        <div className="btcd-hr mt-2 mb-2" />
        <div className="mt-2 flx">
          {__('Select group', 'bit-integrations')}
          <Cooltip width={250} icnSize={17} className="ml-1">
            <div className="txt-body">
              {__('The user will be added or removed from the selected group', 'bit-integrations')}
            </div>
          </Cooltip>
        </div>
        {loading.groups ? (
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
              options={sureMembersConf.groups}
              className="msl-wrp-options"
              defaultValue={sureMembersConf?.selectedGroup}
              onChange={(val) => setChanges(val, 'selectedGroup')}
              style={{ width: '100%' }}
              singleSelect
            />
          </div>
        )}
      </ConfirmModal>
    </div>
  )
}
