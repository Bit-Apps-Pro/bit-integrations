/* eslint-disable no-param-reassign */

import { useState } from 'react'
import { __, sprintf } from '../../../Utils/i18nwrap'
import ConfirmModal from '../../Utilities/ConfirmModal'
import TableCheckBox from '../../Utilities/TableCheckBox'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import Cooltip from '../../Utilities/Cooltip'
import Loader from '../../Loaders/Loader'
import { getWPForoForums, getWPForoGroups, getWPForoReputations } from './WPForoCommonFunc'
import { TASK_LIST_VALUES } from './wpforoConstants'

export default function WPForoActions({ wpforoConf, setWPForoConf, loading, setLoading }) {
  const [actionMdl, setActionMdl] = useState({ show: false })
  const actionHandler = (e, type) => {
    const newConf = { ...wpforoConf }

    if (type === 'reputations') {
      getWPForoReputations(wpforoConf, setWPForoConf, setLoading)
      setActionMdl({ show: 'reputation' })
    } else if (type === 'groups') {
      getWPForoGroups(wpforoConf, setWPForoConf, setLoading)
      setActionMdl({ show: 'group' })
    } else if (type === 'forums') {
      getWPForoForums(wpforoConf, setWPForoConf, setLoading)
      setActionMdl({ show: 'forum' })
    } else if (type === 'tags') {
      setActionMdl({ show: 'tags' })
    } else if (type === 'privateTopic') {
      if (e.target.checked) {
        newConf.actions.privateTopic = true
      } else {
        delete newConf.actions.privateTopic
      }
    }

    setWPForoConf({ ...newConf })
  }

  const clsActionMdl = () => {
    setActionMdl({ show: false })
  }

  const setChanges = (val, type) => {
    const newConf = { ...wpforoConf }
    newConf[type] = val
    setWPForoConf({ ...newConf })
  }

  return (
    <div className="pos-rel d-flx w-8">
      {wpforoConf.selectedTask === TASK_LIST_VALUES.USER_REPUTATION && (
        <>
          <TableCheckBox
            checked={wpforoConf.selectedReputation || false}
            onChange={(e) => actionHandler(e, 'reputations')}
            className="wdt-200 mt-4 mr-2"
            value="select_reputation"
            title={__('Select Reputation', 'bit-integrations')}
            subTitle={__('Select a reputation to set it for the user.', 'bit-integrations')}
          />
          <ConfirmModal
            className="custom-conf-mdl"
            mainMdlCls="o-v"
            btnClass="blue"
            btnTxt={__('Ok', 'bit-integrations')}
            show={actionMdl.show === 'reputation'}
            close={clsActionMdl}
            action={clsActionMdl}
            title={__('Reputations', 'bit-integrations')}>
            <div className="btcd-hr mt-2 mb-2" />
            <div className="mt-2 flx">
              {__('Select Reputation', 'bit-integrations')}
              <Cooltip width={250} icnSize={17} className="ml-1">
                <div className="txt-body">
                  {__('Selected reputation will be set as user new reputation', 'bit-integrations')}
                </div>
              </Cooltip>
            </div>
            {loading.reputation ? (
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
                  options={wpforoConf.reputations}
                  className="msl-wrp-options"
                  defaultValue={wpforoConf?.selectedReputation}
                  onChange={(val) => setChanges(val, 'selectedReputation')}
                  style={{ width: '100%' }}
                  singleSelect
                />
              </div>
            )}
          </ConfirmModal>
        </>
      )}
      {(wpforoConf.selectedTask === TASK_LIST_VALUES.ADD_TO_GROUP ||
        wpforoConf.selectedTask === TASK_LIST_VALUES.REMOVE_FROM_GROUP) && (
        <>
          <TableCheckBox
            checked={wpforoConf.selectedGroup || false}
            onChange={(e) => actionHandler(e, 'groups')}
            className="wdt-200 mt-4 mr-2"
            value="select_group"
            title={__('Select group', 'bit-integrations')}
            subTitle={sprintf(
              __('Select a group to %s', 'bit-integrations'),
              wpforoConf.selectedTask === TASK_LIST_VALUES.ADD_TO_GROUP
                ? __('add a user to it', 'bit-integrations')
                : __('remove a user from it', 'bit-integrations')
            )}
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
                  {sprintf(
                    __('The user will be %s the selected group', 'bit-integrations'),
                    wpforoConf.selectedTask === TASK_LIST_VALUES.ADD_TO_GROUP
                      ? __('added to', 'bit-integrations')
                      : __('removed from', 'bit-integrations')
                  )}
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
                  options={wpforoConf.groups}
                  className="msl-wrp-options"
                  defaultValue={wpforoConf?.selectedGroup}
                  onChange={(val) => setChanges(val, 'selectedGroup')}
                  style={{ width: '100%' }}
                  singleSelect
                />
              </div>
            )}
          </ConfirmModal>
        </>
      )}
      {wpforoConf.selectedTask === TASK_LIST_VALUES.CREATE_TOPIC && (
        <>
          <TableCheckBox
            checked={wpforoConf.selectedForum || false}
            onChange={(e) => actionHandler(e, 'forums')}
            className="wdt-200 mt-4 mr-2"
            value="select_forum"
            title={__('Select Forum', 'bit-integrations')}
            subTitle={__('Select a forum to create a topic in it', 'bit-integrations')}
          />
          <TableCheckBox
            checked={wpforoConf.selectedTags || false}
            onChange={(e) => actionHandler(e, 'tags')}
            className="wdt-200 mt-4 mr-2"
            value="select_tags"
            title={__('Select tags', 'bit-integrations')}
            subTitle={__('Add tags for the topic', 'bit-integrations')}
          />
          <TableCheckBox
            checked={wpforoConf.actions?.privateTopic || false}
            onChange={(e) => actionHandler(e, 'privateTopic')}
            className="wdt-200 mt-4 mr-2"
            value="select_topic_is_private"
            title={__('Private Topic', 'bit-integrations')}
            subTitle={__('Make topic private', 'bit-integrations')}
          />
          <ConfirmModal
            className="custom-conf-mdl"
            mainMdlCls="o-v"
            btnClass="blue"
            btnTxt={__('Ok', 'bit-integrations')}
            show={actionMdl.show === 'forum'}
            close={clsActionMdl}
            action={clsActionMdl}
            title={__('Forums', 'bit-integrations')}>
            <div className="btcd-hr mt-2 mb-2" />
            <div className="mt-2 flx">
              {__('Select Forum', 'bit-integrations')}
              <Cooltip width={250} icnSize={17} className="ml-1">
                <div className="txt-body">
                  {__('Topics will be added to the selected forum', 'bit-integrations')}
                </div>
              </Cooltip>
            </div>
            {loading.forums ? (
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
                  options={wpforoConf.forums}
                  className="msl-wrp-options"
                  defaultValue={wpforoConf?.selectedForum}
                  onChange={(val) => setChanges(val, 'selectedForum')}
                  style={{ width: '100%' }}
                  singleSelect
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
              <Cooltip width={250} icnSize={17} className="ml-1">
                <div className="txt-body">
                  {__(
                    'Separate tags by pressing enter or comma (,) after writing them',
                    'bit-integrations'
                  )}
                </div>
              </Cooltip>
            </div>
            <div className="mt-2">
              <MultiSelect
                options={wpforoConf.tags}
                className="msl-wrp-options"
                defaultValue={wpforoConf?.selectedTags}
                onChange={(val) => setChanges(val, 'selectedTags')}
                style={{ width: '100%' }}
                customValue
              />
            </div>
          </ConfirmModal>
        </>
      )}
    </div>
  )
}
