/* eslint-disable no-param-reassign */

import { useState } from 'react'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useRecoilValue } from 'recoil'
import { $btcbi } from '../../../GlobalStates'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import ConfirmModal from '../../Utilities/ConfirmModal'
import TableCheckBox from '../../Utilities/TableCheckBox'
import { ProFeatureSubtitle, ProFeatureTitle } from '../IntegrationHelpers/ActionProFeatureLabels'
import { getAllTags } from './GetResponseCommonFunc'

export default function GetResponseActions({
  getResponseConf,
  setGetResponseConf,
  formFields,
  loading,
  setLoading
}) {
  const [actionMdl, setActionMdl] = useState({ show: false, action: () => {} })
  const btcbi = useRecoilValue($btcbi)
  const { isPro } = btcbi

  const actionHandler = (e, type) => {
    const newConf = { ...getResponseConf }
    if (type === 'tag') {
      if (e.target?.checked) {
        getAllTags(getResponseConf, setGetResponseConf, setLoading)
        newConf.actions.tags = true
      } else {
        setActionMdl({ show: false })
        delete newConf.actions.tags
      }
      setActionMdl({ show: 'tag' })
    } else if (type === 'update') {
      if (e.target.checked) {
        newConf.actions.update = true
      } else {
        delete newConf.actions.update
      }
    } else if (type === 'dayOfCycle') {
      if (e.target.checked) {
        newConf.actions.dayOfCycle = true
      } else {
        delete newConf.actions.dayOfCycle
      }
      setActionMdl({ show: 'dayOfCycle' })
    }

    setGetResponseConf({ ...newConf })
  }

  const clsActionMdl = () => {
    setActionMdl({ show: false })
  }

  const setChanges = (val, name) => {
    const newConf = { ...getResponseConf }
    if (name === 'selectedTags') {
      newConf['selectedTags'] = val
    } else if (name === 'dayOfCycle') {
      newConf['dayOfCycle'] = val
    }
    setGetResponseConf({ ...newConf })
  }

  return (
    <div className="pos-rel d-flx w-8">
      <TableCheckBox
        checked={getResponseConf?.selectedTags.length || false}
        onChange={e => actionHandler(e, 'tag')}
        className="wdt-200 mt-4 mr-2"
        value="tag"
        title={__('Add Tags', 'bit-integrations')}
        subTitle={__('Add tags contact', 'bit-integrations')}
      />
      <TableCheckBox
        checked={getResponseConf.actions?.update || false}
        onChange={e => actionHandler(e, 'update')}
        className="wdt-200 mt-4 mr-2"
        value="update_contact"
        title={__('Update Contact', 'bit-integrations')}
        subTitle={__('Update Responses with GetResponse exist contact?', 'bit-integrations')}
      />
      {
        <TableCheckBox
          checked={getResponseConf?.dayOfCycle || false}
          onChange={e => actionHandler(e, 'dayOfCycle')}
          className="wdt-200 mt-4 mr-2"
          value="dayOfCycle"
          isInfo={!isPro}
          title={<ProFeatureTitle title={__('Autoresponder day', 'bit-integrations')} />}
          subTitle={
            <ProFeatureSubtitle
              title={__('Autoresponder day', 'bit-integrations')}
              subTitle={__(
                'The day on which the contact is in the Autoresponder cycle',
                'bit-integrations'
              )}
              proVersion="2.1.9"
            />
          }
        />
      }

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
        <div className="mt-2">{__('Select contact Tags', 'bit-integrations')}</div>
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
          <div className="flx flx-between mt-2">
            <MultiSelect
              options={getResponseConf?.tags?.map(tag => ({ label: tag.name, value: tag.tagId }))}
              className="msl-wrp-options"
              defaultValue={getResponseConf?.selectedTags}
              onChange={val => setChanges(val, 'selectedTags')}
            />
            <button
              onClick={() => getAllTags(getResponseConf, setGetResponseConf, setLoading)}
              className="icn-btn sh-sm ml-2 mr-2 tooltip"
              style={{ '--tooltip-txt': `${__('Refresh Groups', 'bit-integrations')}'` }}
              type="button">
              &#x21BB;
            </button>
          </div>
        )}
      </ConfirmModal>

      {isPro && (
        <ConfirmModal
          className="custom-conf-mdl"
          mainMdlCls="o-v"
          btnClass="purple"
          btnTxt={__('Ok', 'bit-integrations')}
          show={actionMdl.show === 'dayOfCycle'}
          close={clsActionMdl}
          action={clsActionMdl}
          title={__('Autoresponder day', 'bit-integrations')}>
          <div className="btcd-hr mt-2 mb-2" />
          <div className="mt-3">
            <b>{__('Autoresponder day', 'bit-integrations')}</b>
          </div>
          <input
            className="btcd-paper-inp mt-1"
            onChange={e => setChanges(e.target.value, 'dayOfCycle')}
            type="number"
            name="dayOfCycle"
            value={getResponseConf.dayOfCycle}
            placeholder={__('Autoresponder day...', 'bit-integrations')}
          />
        </ConfirmModal>
      )}
    </div>
  )
}
