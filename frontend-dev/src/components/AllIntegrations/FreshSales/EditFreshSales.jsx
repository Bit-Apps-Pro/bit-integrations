/* eslint-disable max-len */
/* eslint-disable no-param-reassign */

import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import { $actionConf, $formFields, $newFlow } from '../../../GlobalStates'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import { saveActionConf } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import SetEditIntegComponents from '../IntegrationHelpers/SetEditIntegComponents'
import { checkMappedFields, checkRequired, handleInput } from './FreshSalesCommonFunc'
import FreshSalesIntegLayout from './FreshSalesIntegLayout'

function EditFreshSales({ allIntegURL }) {
  const navigate = useNavigate()
  const { id } = useParams()
  const [freshSalesConf, setFreshSalesConf] = useRecoilState($actionConf)
  const [flow, setFlow] = useRecoilState($newFlow)
  const [isLoading, setIsLoading] = useState(false)
  const [snack, setSnackbar] = useState({ show: false })
  const formFields = useRecoilValue($formFields)

  const setIntegName = (e, freshSalesConf, setFreshSalesConf) => {
    const newConf = { ...freshSalesConf }
    const { name } = e.target

    if (e.target.value !== '') {
      newConf[name] = e.target.value
    } else {
      delete newConf[name]
    }
    setFreshSalesConf({ ...newConf })
  }

  const saveConfig = () => {
    if (!checkMappedFields(freshSalesConf)) {
      setSnackbar({ show: true, msg: __('Please map mandatory fields', 'bit-integrations') })
      return
    }
    if (!checkRequired(freshSalesConf)) {
      if (['Deal', 'Contact'].includes(freshSalesConf.moduleData.module)) {
        setSnackbar({
          show: true,
          msg: __('Please select a account or a contact', 'bit-integrations')
        })
      }
      if (freshSalesConf.moduleData.module === 'Contacts') {
        setSnackbar({ show: true, msg: __('Please select a account', 'bit-integrations') })
      }
      return
    }

    saveActionConf({
      flow,
      setFlow,
      allIntegURL,
      conf: freshSalesConf,
      navigate,
      id,
      edit: 1,
      setIsLoading,
      setSnackbar
    })
  }
  return (
    <div style={{ width: 900 }}>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />

      <div className="flx mt-3">
        <b className="wdt-200 ">{__('Integration Name:', 'bit-integrations')}</b>
        <input
          className="btcd-paper-inp w-5"
          onChange={(e) => setIntegName(e, freshSalesConf, setFreshSalesConf)}
          name="name"
          value={freshSalesConf.name}
          type="text"
          placeholder={__('Integration Name...', 'bit-integrations')}
        />
      </div>
      <br />

      <SetEditIntegComponents entity={flow.triggered_entity} setSnackbar={setSnackbar} />

      <FreshSalesIntegLayout
        formID={flow.triggered_entity_id}
        formFields={formFields}
        handleInput={(e) =>
          handleInput(e, freshSalesConf, setFreshSalesConf, flow.triggered_entity_id, setIsLoading, setSnackbar)
        }
        freshSalesConf={freshSalesConf}
        setFreshSalesConf={setFreshSalesConf}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />

      <IntegrationStepThree
        edit
        saveConfig={saveConfig}
        disabled={freshSalesConf.moduleData.module === '' || freshSalesConf.field_map.length < 1}
        isLoading={isLoading}
        dataConf={freshSalesConf}
        setDataConf={setFreshSalesConf}
        formFields={formFields}
      />
      <br />
    </div>
  )
}

export default EditFreshSales
