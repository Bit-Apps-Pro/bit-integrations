/* eslint-disable no-param-reassign */

import { useState } from 'react'
import { __ } from '../../../Utils/i18nwrap'
import TableCheckBox from '../../Utilities/TableCheckBox'
import ConfirmModal from '../../Utilities/ConfirmModal'
import { getAllCompanies } from './FluentCrmCommonFunc'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import Loader from '../../Loaders/Loader'
import { useRecoilValue } from 'recoil'
import { $btcbi } from '../../../GlobalStates'

export default function FluentCrmActions({ fluentCrmConf, setFluentCrmConf, loading, setLoading, setSnackbar }) {
  const [actionMdl, setActionMdl] = useState({ show: false })
  const btcbi = useRecoilValue($btcbi)
  const { isPro } = btcbi

  const actionHandler = (e, type) => {
    const newConf = { ...fluentCrmConf }
    if (type === 'exists') {
      if (e.target.checked) {
        newConf.actions.skip_if_exists = true
      } else {
        delete newConf.actions.skip_if_exists
      }
    }
    if (type === 'doubleOpIn') {
      if (e.target.checked) {
        newConf.actions.double_opt_in = true
      } else {
        delete newConf.actions.double_opt_in
      }
    }
    if (type === 'company_id') {
      setActionMdl({ show: 'company_id' })
      getAllCompanies(fluentCrmConf, setFluentCrmConf, loading, setLoading, setSnackbar)
    }
    if (type === 'company') {
      newConf.actions.company_id = e
    }

    setFluentCrmConf({ ...newConf })
  }

  const clsActionMdl = () => {
    setActionMdl({ show: false })
  }

  return (
    <div className="pos-rel d-flx w-8">
      <TableCheckBox
        checked={fluentCrmConf.actions?.skip_if_exists || false}
        onChange={(e) => actionHandler(e, 'exists')}
        className="wdt-200 mt-4 mr-2"
        value="skip_if_exists"
        title={__('Skip exist Contact', 'bit-integrations')}
        subTitle={__('Skip if contact already exist in FluentCRM', 'bit-integrations')}
      />
      <TableCheckBox
        checked={fluentCrmConf.actions?.double_opt_in || false}
        onChange={(e) => actionHandler(e, 'doubleOpIn')}
        className="wdt-200 mt-4 mr-2"
        value="double_opt_in"
        title={__('Double Opt-in', 'bit-integrations')}
        subTitle={__('Enable Double Option for new contacts', 'bit-integrations')}
      />
      <TableCheckBox
        checked={fluentCrmConf.actions?.company_id || false}
        onChange={(e) => actionHandler(e, 'company_id')}
        className="wdt-200 mt-4 mr-2"
        value="company_id"
        isInfo={!isPro}
        title={`${__('Assign Company', 'bit-integrations')} ${!isPro ? '(Pro)' : ''}`}
        subTitle={isPro
          ? __('Assign Company for contact', 'bit-integrations')
          : sprintf(
            __(
              'The Bit Integration Pro v(%s) plugin needs to be installed and activated to enable the %s feature',
              'bit-integrations'
            ),
            '2.3.8',
            __('Assign Company', 'bit-integrations')
          )
        }
      />

      {isPro && (
        <ConfirmModal
          className="custom-conf-mdl"
          mainMdlCls="o-v"
          btnClass="purple"
          btnTxt={__('Ok', 'bit-integrations')}
          show={actionMdl.show === 'company_id'}
          close={clsActionMdl}
          action={clsActionMdl}
          title={__('Assign Company', 'bit-integrations')}>
          <div className="btcd-hr mt-2 mb-2" />
          <div className="mt-2">{__('Select Company', 'bit-integrations')}</div>
          {loading?.company ? (
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
            <div className="flx flx-center mt-2">
              <MultiSelect
                options={fluentCrmConf?.companies && fluentCrmConf.companies.map(item => ({ label: item.label, value: item.id.toString() }))}
                className="msl-wrp-options"
                defaultValue={fluentCrmConf.actions?.company_id?.toString() || ''}
                onChange={(val) => actionHandler(val, 'company')}
                singleSelect
                selectOnClose
              />
              <button
                onClick={() =>
                  getAllCompanies(fluentCrmConf, setFluentCrmConf, loading, setLoading, setSnackbar)
                }
                className="icn-btn sh-sm ml-2 mr-2 tooltip"
                style={{
                  '--tooltip-txt': `'${__('Refresh Companies', 'bit-integrations')}'`
                }}
                type="button"
                disabled={loading?.company}>
                &#x21BB;
              </button>
            </div>
          )}
        </ConfirmModal>
      )}
    </div>
  )
}
