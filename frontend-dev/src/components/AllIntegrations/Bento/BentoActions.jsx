/* eslint-disable max-len */
/* eslint-disable no-param-reassign */

import { create } from 'mutative'
import { useState } from 'react'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useRecoilValue } from 'recoil'
import { $btcbi } from '../../../GlobalStates'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import ConfirmModal from '../../Utilities/ConfirmModal'
import TableCheckBox from '../../Utilities/TableCheckBox'
import { ProFeatureTitle } from '../IntegrationHelpers/ActionProFeatureLabels'
import { getAllTags } from './BentoCommonFunc'

export default function BentoActions({
  bentoConf,
  setBentoConf,
  loading,
  setLoading,
  isLoading,
  setIsLoading,
  setSnackbar
}) {
  const [actionMdl, setActionMdl] = useState({ show: false })
  const btcbi = useRecoilValue($btcbi)
  const { isPro } = btcbi

  const actionHandler = (e, type) => {
    if (type === 'add_tags' || type === 'add_tags_via_event') {
      getAllTags(bentoConf, setBentoConf, setLoading)
    } else if (type === 'subscribe') {
      setBentoConf(prevConf =>
        create(prevConf, draftConf => {
          draftConf[type] = Boolean(e.target.checked)
        })
      )
    }

    setActionMdl({ show: type })
  }

  const clsActionMdl = () => {
    setActionMdl({ show: false })
  }

  const setChanges = (val, type) => {
    setBentoConf(prevConf =>
      create(prevConf, draftConf => {
        draftConf[type] = val
      })
    )
  }

  return (
    <>
      <div className="pos-rel d-flx w-8">
        {'add_people' === bentoConf.action && (
          <>
            <TableCheckBox
              onChange={e => actionHandler(e, 'add_tags')}
              checked={bentoConf?.selected_tags?.length > 0 || false}
              className="wdt-200 mt-4 mr-2"
              value="add_tags"
              isInfo={!isPro}
              title={<ProFeatureTitle title={__('Add Tags', 'bit-integrations')} />}
              subTitle={'Add Tags'}
            />
            <TableCheckBox
              onChange={e => actionHandler(e, 'add_tags_via_event')}
              checked={bentoConf?.selected_tags_via_event?.length > 0 || false}
              className="wdt-200 mt-4 mr-2"
              value="add_tags_via_event"
              isInfo={!isPro}
              title={<ProFeatureTitle title={__('Add Tags via Event', 'bit-integrations')} />}
              subTitle={'Add Tags via Event'}
            />
            <TableCheckBox
              onChange={e => actionHandler(e, 'subscribe')}
              checked={bentoConf?.subscribe || false}
              className="wdt-200 mt-4 mr-2"
              value="subscribe"
              isInfo={!isPro}
              title={<ProFeatureTitle title={__('Subscribe', 'bit-integrations')} />}
              subTitle={'Subscribe User'}
            />
          </>
        )}

        {isPro && (
          <>
            <ConfirmModal
              className="custom-conf-mdl"
              mainMdlCls="o-v"
              btnClass="purple"
              btnTxt={__('Ok', 'bit-integrations')}
              show={actionMdl.show === 'add_tags'}
              close={clsActionMdl}
              action={clsActionMdl}
              title={__('Add Tags', 'bit-integrations')}>
              <div className="btcd-hr mt-2 mb-2" />
              {loading?.tags ? (
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
                <div className="flx mt-2">
                  <MultiSelect
                    className="msl-wrp-options"
                    defaultValue={bentoConf?.selected_tags}
                    options={bentoConf.tags}
                    onChange={val => setChanges(val, 'selected_tags')}
                  />
                  <button
                    onClick={() => getAllTags(bentoConf, setBentoConf, setLoading)}
                    className="icn-btn sh-sm ml-2 mr-2 tooltip"
                    style={{ '--tooltip-txt': `'${__('Refresh Tags', 'bit-integrations')}'` }}
                    type="button">
                    &#x21BB;
                  </button>
                </div>
              )}
            </ConfirmModal>
            <ConfirmModal
              className="custom-conf-mdl"
              mainMdlCls="o-v"
              btnClass="purple"
              btnTxt={__('Ok', 'bit-integrations')}
              show={actionMdl.show === 'add_tags_via_event'}
              close={clsActionMdl}
              action={clsActionMdl}
              title={__('Add Tags via Event', 'bit-integrations')}>
              <div className="btcd-hr mt-2 mb-2" />
              {loading?.tags ? (
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
                <div className="flx mt-2">
                  <MultiSelect
                    className="msl-wrp-options"
                    defaultValue={bentoConf?.selected_tags_via_event}
                    options={bentoConf.tags}
                    onChange={val => setChanges(val, 'selected_tags_via_event')}
                  />
                  <button
                    onClick={() => getAllTags(bentoConf, setBentoConf, setLoading)}
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
