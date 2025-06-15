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
import { checkMappedFields, handleInput } from './CopperCRMCommonFunc'
import CopperCRMIntegLayout from './CopperCRMIntegLayout'

function EditCopperCRM({ allIntegURL }) {
  const navigate = useNavigate()
  const { id } = useParams()
  const [flow, setFlow] = useRecoilState($newFlow)
  const [coppercrmConf, setCopperCRMConf] = useRecoilState($actionConf)
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState({})
  const [snack, setSnackbar] = useState({ show: false })
  const formField = useRecoilValue($formFields)

  const saveConfig = () => {
    if (!checkMappedFields(coppercrmConf)) {
      setSnackbar({ show: true, msg: __('Please map mandatory fields', 'bit-integrations') })
      return
    }

    if (coppercrmConf.actionName === 'opportunity') {
      if (!coppercrmConf.selectedCRMPeople) {
        toast.error('Please select a people')
        return
      }
      if (!coppercrmConf.selectedCRMPipelines && coppercrmConf.actionName === 'opportunity') {
        toast.error('Please select a Pipeline')
        return
      }
    }

    saveActionConf({ flow, allIntegURL, conf: coppercrmConf, navigate, edit: 1, setLoading, setSnackbar })
  }

  return (
    <div style={{ width: 900 }}>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />

      <div className="flx mt-3">
        <b className="wdt-200 d-in-b">{__('Integration Name:', 'bit-integrations')}</b>
        <input className="btcd-paper-inp w-5" onChange={e => handleInput(e, coppercrmConf, setCopperCRMConf)} name="name" value={coppercrmConf.name} type="text" placeholder={__('Integration Name...', 'bit-integrations')} />
      </div>
      <br />

      <SetEditIntegComponents entity={flow.triggered_entity} setSnackbar={setSnackbar} />
      <CopperCRMIntegLayout
        formID={flow.triggered_entity_id}
        formFields={formField}
        handleInput={(e) => handleInput(e, coppercrmConf, setCopperCRMConf, setLoading, setSnackbar)}
        coppercrmConf={coppercrmConf}
        setCopperCRMConf={setCopperCRMConf}
        loading={loading}
        setLoading={setLoading}
        setSnackbar={setSnackbar}
      />

      <IntegrationStepThree
        edit
        saveConfig={saveConfig}
        disabled={!checkMappedFields(coppercrmConf)}
        isLoading={isLoading}
        dataConf={coppercrmConf}
        setDataConf={setCopperCRMConf}
        formFields={formField}
      />
      <br />
    </div>
  )
}

export default EditCopperCRM
