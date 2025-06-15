/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */

import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import { $actionConf, $formFields, $newFlow } from '../../../GlobalStates'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import EditFormInteg from '../EditFormInteg'
import SetEditIntegComponents from '../IntegrationHelpers/SetEditIntegComponents'
import EditWebhookInteg from '../EditWebhookInteg'
import { saveActionConf } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import { checkMappedFields, handleInput } from './SalesflareCommonFunc'
import SalesflareIntegLayout from './SalesflareIntegLayout'

function EditSalesflare({ allIntegURL }) {
  const navigate = useNavigate()
  const { id } = useParams()
  const [flow, setFlow] = useRecoilState($newFlow)
  const [salesflareConf, setSalesflareConf] = useRecoilState($actionConf)
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState({})
  const [snack, setSnackbar] = useState({ show: false })
  const formField = useRecoilValue($formFields)

  const saveConfig = () => {
    if (!checkMappedFields(salesflareConf)) {
      setSnackbar({ show: true, msg: __('Please map mandatory fields', 'bit-integrations') })
      return
    }

    if (salesflareConf.actionName === 'opportunities') {
      if (!salesflareConf.selectedAccount) {
        toast.error('Please select an Account')
        return
      }
      if (!salesflareConf.selectedPipeline) {
        toast.error('Please select a Pipeline')
        return
      }
      if (salesflareConf.selectedPipeline && !salesflareConf.selectedStage) {
        toast.error('Please select a Stage')
        return
      }
    }

    saveActionConf({ flow, allIntegURL, conf: salesflareConf, navigate, edit: 1, setIsLoading, setSnackbar })
  }

  return (
    <div style={{ width: 900 }}>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />

      <div className="flx mt-3">
        <b className="wdt-200 d-in-b">{__('Integration Name:', 'bit-integrations')}</b>
        <input className="btcd-paper-inp w-5" onChange={e => handleInput(e, salesflareConf, setSalesflareConf)} name="name" value={salesflareConf.name} type="text" placeholder={__('Integration Name...', 'bit-integrations')} />
      </div>
      <br />

      <SetEditIntegComponents entity={flow.triggered_entity} setSnackbar={setSnackbar} />
      <SalesflareIntegLayout
        formID={flow.triggered_entity_id}
        formFields={formField}
        handleInput={(e) => handleInput(e, salesflareConf, setSalesflareConf, setLoading, setSnackbar)}
        salesflareConf={salesflareConf}
        setSalesflareConf={setSalesflareConf}
        loading={loading}
        setLoading={setLoading}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />

      <IntegrationStepThree
        edit
        saveConfig={saveConfig}
        disabled={!checkMappedFields(salesflareConf)}
        isLoading={isLoading}
        dataConf={salesflareConf}
        setDataConf={setSalesflareConf}
        formFields={formField}
      />
      <br />
    </div>
  )
}

export default EditSalesflare
