/* eslint-disable no-param-reassign */

import { useState } from 'react'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { __ } from '../../../Utils/i18nwrap'
import ConfirmModal from '../../Utilities/ConfirmModal'
import TableCheckBox from '../../Utilities/TableCheckBox'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import Loader from '../../Loaders/Loader'
import Cooltip from '../../Utilities/Cooltip'
import { getHighLevelOptions } from './HighLevelCommonFunc'
import { $btcbi } from '../../../GlobalStates'
import { useRecoilValue } from 'recoil'
import { TASK_LIST_VALUES } from './highlevelConstants'

export default function HighLevelActions({ highLevelConf, setHighLevelConf, loading, setLoading }) {
  const [actionMdl, setActionMdl] = useState({ show: false })
  const btcbi = useRecoilValue($btcbi)
  const { isPro } = btcbi
  const [utilityOptions, setUtilityOptions] = useState({})
  const actionHandler = (e, type) => {
    const newConf = { ...highLevelConf }

    if (type === 'checkbox') {
      if (e.target.checked) {
        newConf.actions[e.target.value] = true
      } else {
        delete newConf.actions[e.target.value]
      }
    } else if (type === 'contactTags') {
      getHighLevelOptions(
        'high_level_contact_tags',
        highLevelConf,
        utilityOptions,
        setUtilityOptions,
        type,
        loading,
        setLoading,
        'Tags'
      )
      setActionMdl({ show: type })
    }

    setHighLevelConf({ ...newConf })
  }

  const clsActionMdl = () => {
    setActionMdl({ show: false })
  }

  const setChanges = (val, type) => {
    const newConf = { ...highLevelConf }
    newConf[type] = val
    setHighLevelConf({ ...newConf })
  }

  return (
    <>
      {!isPro && (
        <div className="pt-2">
          <span className="actions-note">
            The Bit Integrations Pro plugin needs to be installed and activated to utilize these
            features.
          </span>
        </div>
      )}
      <div className="pos-rel d-flx w-8">
        {(highLevelConf.selectedTask === TASK_LIST_VALUES.CREATE_CONTACT ||
          highLevelConf.selectedTask === TASK_LIST_VALUES.UPDATE_CONTACT) && (
          <TableCheckBox
            checked={highLevelConf.actions?.dnd || false}
            onChange={(e) => actionHandler(e, 'checkbox')}
            className="wdt-200 mt-4 mr-2"
            value="dnd"
            title={__('Do Not Disturb', 'bit-integrations')}
            subTitle={__('Enable do not disturb for contact.', 'bit-integrations')}
            isInfo={!isPro}
          />
        )}

        {(highLevelConf.selectedTask === TASK_LIST_VALUES.CREATE_CONTACT ||
          highLevelConf.selectedTask === TASK_LIST_VALUES.UPDATE_CONTACT ||
          highLevelConf.selectedTask === TASK_LIST_VALUES.CREATE_OPPORTUNITY ||
          highLevelConf.selectedTask === TASK_LIST_VALUES.UPDATE_OPPORTUNITY) && (
          <>
            <TableCheckBox
              checked={highLevelConf.selectedTags || false}
              onChange={(e) => actionHandler(e, 'contactTags')}
              className="wdt-200 mt-4 mr-2"
              value="select_menu_post_type"
              title={__('Select Tags', 'bit-integrations')}
              subTitle={__('Select tags and assign them to the contact.', 'bit-integrations')}
              isInfo={!isPro}
            />
            <ConfirmModal
              className="custom-conf-mdl"
              mainMdlCls="o-v"
              btnClass="blue"
              btnTxt={__('Ok', 'bit-integrations')}
              show={actionMdl.show === 'contactTags'}
              close={clsActionMdl}
              action={clsActionMdl}
              title={__('Post Types', 'bit-integrations')}>
              <div className="btcd-hr mt-2 mb-2" />
              <div className="mt-2 flx">
                {__('Select Tags', 'bit-integrations')}
                <Cooltip width={350} icnSize={17} className="ml-1">
                  <div className="txt-body">
                    {__(
                      'Choose from the existing tags, or create and add new ones by typing them and pressing enter or comma (,).',
                      'bit-integrations'
                    )}
                  </div>
                </Cooltip>
              </div>
              {loading.options ? (
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
                    options={utilityOptions?.contactTags}
                    className="msl-wrp-options"
                    defaultValue={highLevelConf?.selectedTags}
                    onChange={(val) => setChanges(val, 'selectedTags')}
                    style={{ width: '100%' }}
                    customValue
                  />
                  <button
                    onClick={() =>
                      getHighLevelOptions(
                        'high_level_contact_tags',
                        highLevelConf,
                        utilityOptions,
                        setUtilityOptions,
                        'contactTags',
                        loading,
                        setLoading,
                        'Tags'
                      )
                    }
                    className="icn-btn sh-sm ml-2 mr-2 tooltip"
                    style={{ '--tooltip-txt': `'${__('Refresh Tags', 'bit-integrations')}'` }}
                    type="button">
                    &#x21BB;
                  </button>
                </div>
              )}
            </ConfirmModal>
          </>
        )}
      </div>
    </>
  )
}
