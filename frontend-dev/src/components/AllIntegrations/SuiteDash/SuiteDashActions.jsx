/* eslint-disable no-param-reassign */

import { useState } from 'react'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import ConfirmModal from '../../Utilities/ConfirmModal'
import TableCheckBox from '../../Utilities/TableCheckBox'
import { getAllCompanies } from './SuiteDashCommonFunc'

export default function SuiteDashActions({ suiteDashConf, setSuiteDashConf, loading, setLoading }) {
  const [actionMdl, setActionMdl] = useState({ show: false, action: () => { } })

  const actionHandler = (e, type) => {
    const newConf = { ...suiteDashConf }
    if (type === 'company') {
      if (e.target?.checked) {
        if (newConf.companies === undefined) {
          newConf.companies = getAllCompanies(suiteDashConf, setSuiteDashConf, setLoading)
        }
        newConf.actions.company = true
      } else {
        setActionMdl({ show: false })
        delete newConf.actions.company
      }
    } 

    setActionMdl({ show: type })
    setSuiteDashConf({ ...newConf })
  }

  const clsActionMdl = () => {
    setActionMdl({ show: false })
  }

  const setChanges = (val, name) => {
    setSuiteDashConf(prevConf => {
      prevConf[name] = val
      return prevConf
    })
  }

  return (
    <div className="pos-rel d-flx flx-wrp">
      {suiteDashConf.actionName === 'contact' && <TableCheckBox checked={suiteDashConf?.selectedCompany?.length || false} onChange={(e) => actionHandler(e, 'company')} className="wdt-200 mt-4 mr-2" value="company" title={__('Add Company', 'bit - integrations')} subTitle={__('Add Company')} />}

      <ConfirmModal
        className="custom-conf-mdl"
        mainMdlCls="o-v"
        btnClass="blue"
        btnTxt={__('Ok', 'bit-integrations')}
        show={actionMdl.show === 'company'}
        close={clsActionMdl}
        action={clsActionMdl}
        title={__('company', 'bit-integrations')}
      >
        <div className="btcd-hr mt-2 mb-2" />
        <div className="mt-2">
          {__('Select Company', 'bit-integrations')}
        </div>
        {
          loading.companies ? (
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
                  options={suiteDashConf?.companies?.map(company => ({ label: company, value: company }))}
                  className="msl-wrp-options"
                  defaultValue={suiteDashConf.selectedCompany}
                  onChange={val => setChanges(val, 'selectedCompany')}
                  singleSelect
                />
                <button onClick={() => getAllCompanies(suiteDashConf, setSuiteDashConf, setLoading)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `${__('Refresh Companies', 'bit-integrations')}'` }} type="button">&#x21BB;</button>
              </div>
            )
        }
      </ConfirmModal>

    </div>
  )
}

